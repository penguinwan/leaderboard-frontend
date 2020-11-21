deploy_s3:
	mkdir -p target
	aws cloudformation package \
		--region eu-central-1 \
		--template-file deployment/leaderboard-frontend.yaml \
		--output-template-file target/leaderboard-frontend.yaml \
		--s3-bucket com.penguinwan.deployment
	aws --region eu-central-1 cloudformation deploy \
		--template-file target/leaderboard-frontend.yaml \
		--stack-name leaderboard-frontend \
		--no-fail-on-empty-changeset \
		--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

rwildcard=$(wildcard $1$2) $(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2))
file_targets=$(shell find build -mindepth 1 -maxdepth 3 -type f)

.PHONY: build
build:
	npm run build

find_url=$(shell aws cloudformation describe-stacks --stack-name api | grep 'OutputValue' | sed 's/OutputValue//g' | sed 's/[",: ]//g')	
.PHONY: $(find_url)
$(find_url):
	cat src/env-template.js | sed -e 's/{id}/$@/g' > src/env.js

.PHONY: replace_api_url
replace_api_url: $(find_url)

.PHONY: $(file_targets) 
$(file_targets):
	aws s3api put-object --bucket com.penguinwan.leaderboard --content-type text/html --key $(shell echo $@ | sed 's/build\///') --body $@ &> /dev/null
	sleep 1

.PHONY: deploy_frontend
deploy_frontend: replace_api_url build $(file_targets)
