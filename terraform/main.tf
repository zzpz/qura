terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>4.0"
    }
  }
}

provider "aws" {
  # region = var.region # defined in ./config
  shared_credentials_files = ["./credentials"] #credentials from ./credentials
  shared_config_files      = ["./config"]
}


# The resource random_pet generates random pet names that are intended to be used
# as unique identifiers for other resources.
resource "random_pet" "pet_name" {

}

resource "aws_iam_user" "verified_user" {
  name = "verified_user"
}

# This resource assigns policy to a specific user
resource "aws_iam_user_policy_attachment" "attachment" {
  user       = aws_iam_user.verified_user.name
  policy_arn = aws_iam_policy.s3_admin_policy.arn
}

resource "aws_iam_user_policy_attachment" "db_crud" {
  user       = aws_iam_user.verified_user.name
  policy_arn = aws_iam_policy.dynamo_crud_policy.arn
}
