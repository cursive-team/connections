## Deployment Guide

### Sections:
- [Infra Phases](#infra-phases)
- [Phase 1: Creating / Destroying Infra](#phase-1-creating--destroying-infra)
- [Phase 2: Updating Infra](#phase-2-updating-infra-)
- [Push Image on New Tag](#push-image-on-new-tag-)
- [Apply Terraform on New Tag](#apply-terraform-on-new-tag)

### Appendix: 
- [Dependency Installation](#dependency-installation-)
- [Manually Create and Apply Admin User](#manually-create-and-apply-admin-user)
- [Creating a New Tag](#creating-a-new-tag)
- [Manually Push Tag to ECR](#manually-push-tag-to-ecr-)
- [Deployment TODOs](#todo)

### Infra Phases

There are two distinct phases for infra.

The first phase is infra creation / destruction. This phase is manual.

The second phase is delegating permission for updating the infra. Github Actions will be used for [building and pushing images to ECR](#push-image-on-tag) and [applying terraform on the infra to use the latest image](#apply-terraform-on-new-tag). 

### Phase 1: Creating / Destroying Infra

Given the risky / high-stakes nature of creating and destroying infra it will be a manual operation that requires developer action. 

For instructions for local setup go to [Set Up Admin Profile](#set-up-admin-profile-).

The admin will need to be created manually the first time. For instructions refer to [Manually Create Admin Role](#manually-create-admin-role-).

Once set up, the only other step is to uncomment two lines in the [`provider.tf`](provider.tf) related to terraform using local credentials. 

To create the infra, run these commands: 
``` 
terraform init
terraform plan
terraform apply
```

Following `apply` keep note of the output roles arns, these will be needed for the next step.

And to destroy resources: 
``` 
terraform destroy
```

### Phase 2: Updating Infra 

Given the repeated nature of updating, it's important to have a streamlined, automated, and tightly scoped process for updating our infra. 

The prior creation step (`terraform apply`) will create the roles required for this step. 

Once these arns are added to the Github Actions in `.github/workflows` the actions do the rest. 

The only developer action required will be to [create a new tag](#creating-a-new-tag) in this github repo. 

### Push Image on New Tag
`.github/workflows/buildImage.yaml` is responsible for building and pushing images to an ECR ([Elastic Container Registry](https://aws.amazon.com/ecr/)) repo. The action is triggered when a new tag is created in this Github repo.

### Apply Terraform on New Tag

[Terraform](https://www.terraform.io/) is an IaC (Infra as Code) tool which allows infra (in our case, AWS cloud resources) to be declared explicitly in code and applied directly to our AWS account.

After a tag is created, the service image(s) will be built and pushed to our ECR repo corresponding to the newest version.

After a successful push, our Terraform code will be applied to our AWS account to update our current resources to using the newest image version.

One goal I have for the terraform setup is to have a validation step (ideally automated, but realistically probably manual) to check the new version works, and _then and only then_ point the ALB (Amazon Load Balancer) to the new version from the old version. At that point we can either destroy the old version or keep it around in the event we need to failover. This goal is the main "known unknown" in the Terraform setup at this point.

## Appendix

### Dependency Installation 

Install terraform:
``` 
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

Install docker:
``` 
brew install --cask docker
```

### Manually Create and Apply Admin User

Create User: 
- Navigate to IAM Users
- Select `Create user`.
- Set name (e.g. `connections-admin`) and click next.
- Select `Attach policies directly` and attach `AdministratorAccess` and click next. 
- `Create user`.

Create Key Pair for User:
- Navigate to user details.
- Select `Create access key` in upper right. 
- Select `Command Line Interface (CLI)` and click next.
- `Create access key`.
- Record values, going to need them in the next step. 

Create Local Profile for User: 
- `brew install awscli`
- `aws configure --profile connections-admin`
- Provide AWS Access Key ID from last section.
- Provide AWS Secret Access Key from last section. 
- Provide default region name: `ap-southeast-1` (Singapore).


### Creating and Running Docker Image 
``` 
docker image build -t connections:1 -f ./Dockerfile .
```

Run on port 8080:
``` 
docker run -td -p 8080:8080 connections:1
```

### Manually Push Tag to ECR 

``` 
export ACCOUNT_NUMBER="${AWS account number}"
export AWS_REGION="ap-southeast-1"
export ECR_REPO_NAME=${Repo name} 
export $IMAGE-ID=${Image ID from docker image build}

aws ecr get-login-password --profile connections-admin-role --region $AWS_REGION 

docker login --username AWS --password-stdin $ACCOUNT_NUMBER.dkr.ecr.$AWS_REGION.amazonaws.com 

docker tag $IMAGE-ID $ACCOUNT_NUMBER.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:1`
docker push $ACCOUNT_NUMBER.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:1`
```

### TODO
- [ ] Make a Github Secret for generated role.
- [ ] Add networking and ECS resources to terraform code.
- [ ] Add Github Action to run `terraform apply` on latest tag.
- [ ] Create rollback command, some way of rolling back to last healthy version.
- [ ] Have some manual testing step, ie running `apply` creates newest version but the ALB won't point to it until it's been manually validated.
- [ ] Figure out how to fully manage AWS resources so terraform can also destroy them.
- [ ] Minimize scope of github action policy.
- [ ] swap to AWS CLI V2 (https://aws.amazon.com/cli/)

Terraform resources for next step: 
- The VPC (virtual private cloud) that holds our subnet
- The subnet within the VPC that holds our ECS container(s)
- The Route Table that configures routing for the subnet
- The Internet Gateway to make our resources available to the internet at specific IP addresses
- ECS that's running the backend container
- Security Groups (like a firewall) to manage access

resources:
- https://harrisoncramer.me/setting-up-docker-with-terraform-and-ec2/
