# for enabling an ec2 to assume role with policy s3_admin

####################################################
##        EC2 + role assumed                      ##
####################################################
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-profile"
  role = aws_iam_role.admin.name
}


####################################################
##        Roles                                   ##
####################################################

# roles are assumed by resources (ec2)

resource "aws_iam_role" "admin" {
  name               = "Administrator"
  description        = "Administrator role for EC2 instance"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role_policy.json
}

resource "aws_iam_role" "dynamodb_editor" {
  name               = "dynamo-db-editor"
  description        = "Role to enable editing of the dynamo DB resource"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role_policy.json

  tags = {

  }
}

####################################################
##        Policy Attachments                      ##
####################################################

# policies are attached to roles
resource "aws_iam_role_policy_attachment" "s3_admin_attach" {
  role       = aws_iam_role.admin.name
  policy_arn = aws_iam_policy.s3_admin_policy.arn
}

resource "aws_iam_role_policy_attachment" "dynamodb_admin_attach" {
  role       = aws_iam_role.admin.name
  policy_arn = aws_iam_policy.dynamo_admin_policy.arn

}

resource "aws_iam_role_policy_attachment" "iam_admin_attach" {
  role       = aws_iam_role.admin.name
  policy_arn = aws_iam_policy.iam_admin_policy.arn
}

####################################################
##        Policies                                ##
####################################################


# The iam_policy resource and iam_policy_document data source used together will create a policy
resource "aws_iam_policy" "s3_admin_policy" {
  name_prefix = "s3-admin-policy-"
  description = "Admin s3 policy"
  policy      = data.aws_iam_policy_document.s3_policy_doc.json
}


resource "aws_iam_policy" "iam_admin_policy" {
  name_prefix = "iam-admin-policy-"
  policy      = data.aws_iam_policy_document.iam_admin.json

}

resource "aws_iam_policy" "dynamo_admin_policy" {
  name_prefix = "dynamo-admin-policy"
  description = "Admin dynamo policy"
  policy = data.aws_iam_policy_document.dynamodb_admin_doc.json
}

resource "aws_iam_policy" "dynamo_crud_policy" {
  name_prefix = "dnyamo-CRUD-policy-"
  description = "CRUD dynamo policy"
  policy = data.aws_iam_policy_document.dynamodb_crud_policy_doc.json
}

####################################################
##        Policy documents                        ##
####################################################



data "aws_iam_policy_document" "iam_admin" {
  statement {
    sid       = "ANYTHING"
    actions   = ["iam:*"]
    resources = ["*"]
    effect    = "Allow"
  }
}

data "aws_iam_policy_document" "s3_policy_doc" {

  # do anything on s3
  statement {
    sid = "AmazonS3FullAccess"
    actions = [
      "s3:*",
      "s3-object-lambda:*"
    ]
    resources = ["*"]
    effect    = "Allow"
  }

  statement {
    #Statement IDs (SID) must be alpha-numeric. Check that your input satisfies the regular expression [0-9A-Za-z]*
    sid = "SuperUser"
    actions = [
      "s3:*",
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:GetObject",
      "s3:GetObjectAcl",
      "s3:AbortMultipartUpload"
    ]
    resources = [aws_s3_bucket.uploaded_files.arn,
    "${aws_s3_bucket.uploaded_files.arn}/*"]
    effect = "Allow"
  }
}

# instance assume role policy
data "aws_iam_policy_document" "ec2_assume_role_policy" {
  # this allows a service to assume roles (ec2 instance)
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "dynamodb_crud_policy_doc" {

  # create item
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:BatchGetItem",
      "dynamodb:Query",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:BatchWriteItem"
    ]
    resources = [aws_dynamodb_table.uploaded_files.arn, aws_dynamodb_table.comments.arn]

  }

}

data "aws_iam_policy_document" "dynamodb_admin_doc" {
  statement {
    sid       = "SuperUser"
    effect    = "Allow"
    actions   = ["dynamodb:*"]
    resources = ["*"]
  }
}