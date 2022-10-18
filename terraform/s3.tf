# https://registry.terraform.io/modules/terraform-aws-modules/s3-bucket/aws/latest
resource "aws_s3_bucket" "uploaded_files" {

  #only lowercase alphanumeric characters and hyphens allowed
  bucket_prefix = "uploaded-files-"
  force_destroy = true  # TODO: ONLY FOR DEVELOPMENT

  tags = {
    Name        = "Uploaded Files"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_acl" "uploaded_files" {
  bucket = aws_s3_bucket.uploaded_files.id
  acl    = "private"
}

resource "aws_s3_bucket_policy" "allow_access_from_another_account" {
  bucket = aws_s3_bucket.uploaded_files.id
  policy = data.aws_iam_policy_document.allow_cloudflare_to_access.json
}

data "aws_iam_policy_document" "allow_cloudflare_to_access" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.viewall.iam_arn}"]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.uploaded_files.arn,
      "${aws_s3_bucket.uploaded_files.arn}/*",
    ]
  }
}