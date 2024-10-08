terraform {
  backend "s3" {
    bucket  = "connections-tfstate" # name of the s3 bucket that was manually created
    key     = ".terraform/terraform.tfstate"
    region  = "ap-southeast-1"
    encrypt = true

    # For creating initial tfstate
    # shared_credentials_files = ["~/.aws/credentials"]
    # profile = "connections-admin"
  }
}