terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region     = "${var.aws_region}"

  default_tags {
    tags = {
      ManagedBy = "Terraform"
    }
  }

  # For creating / destroying infra with Admin profile
  # shared_credentials_files = ["~/.aws/credentials"]
  # profile = "connections-admin"
}