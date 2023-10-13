#!/bin/bash
#aws ecr list-images --repository-name=sd-gen-webui-automatic1111 --query 'sort_by(imageDetails,& imagePushedAt)[*]'
#aws ecr describe-images --repository-name=sd-gen-webui-automatic1111 --query 'sort_by(imageDetails,& imagePushedAt)[*]'


export IMAGE_TAG=$(aws ecr describe-images --output json --repository-name sd-gen-webui-automatic1111 --query 'sort_by(imageDetails,& imagePushedAt)[-1].imageTags[0]' | jq . --raw-output)
echo 'IMAGE_TAG:' $IMAGE_TAG

. ./snapshot.sh -r ap-northeast-1 331102492406.dkr.ecr.ap-northeast-1.amazonaws.com/sd-gen-webui-automatic1111:$IMAGE_TAG
echo "IMAGE_TAG=$IMAGE_TAG" >> "$GITHUB_ENV"
echo "SNAPSHOT_ID=$SNAPSHOT_ID" >> "$GITHUB_ENV"
