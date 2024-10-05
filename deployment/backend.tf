terraform {
  backend "s3" {
    bucket  = "connections-tfstate" # name of the s3 bucket that was manually created
    key     = "connections/terraform.tfstate"
    region  = var.region
    encrypt = true
  }
}