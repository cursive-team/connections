## Deployment Guide 

### Sections: 
1. [Push Image on Tag](#1-push-image-on-tag-)
2. [Apply Terraform on New Tag](#2-apply-terraform-on-new-tag)

### 1. Push Image on Tag 
`.github/workflows/buildImage.yaml` is responsible for building and pushing images to an ECR ([Elastic Container Registry](https://aws.amazon.com/ecr/)) `cursive/connections` repo. The action is triggered when a new tag is created in this Github repo. 

The `github_actions` role uses this policy to push to the ECR repo. Once the Terraform + Github Action flow works I will reduce the scope of ecr actions (note it's currently `ecr:*`).
``` 
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:*",
                "cloudtrail:LookupEvents"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "iam:AWSServiceName": [
                        "replication.ecr.amazonaws.com"
                    ]
                }
            }
        }
    ]
}
```

### 2. Apply Terraform on New Tag

[Terraform](https://www.terraform.io/) is an IaC (Infra as Code) tool which allows infra (in our case, AWS cloud resources) to be declared explicitly in code and applied directly to our AWS account.

After a tag is created, the service image(s) will be built and pushed to our ECR repo corresponding to the newest version. 

After a successful push, our Terraform code will be applied to our AWS account to update our current resources to using the newest image version. 

One goal I have for the terraform setup is to have a validation step (ideally automated, but realistically probably manual) to check the new version works, and _then and only then_ point the ALB (Amazon Load Balancer) to the new version from the old version. At that point we can either destroy the old version or keep it around in the event we need to failover. This goal is the main "known unknown" in the Terraform setup at this point. 