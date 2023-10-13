# Pre-request
Kenpenter with dev and prod env

build ML model docker image
> push to ECR
> obtain a image tag
build EBS
> get latest three image tag <-  how??
> pre-fetch the image
> take EBS snapshot
> obtain a snapshot id
Update k8s yaml
> update karpenter node template (snapshot id)
    >  kustomize, commit and push to testing branch
> update ML model deploy <- its in backend API server project, how????
    > build a latest helm chart????