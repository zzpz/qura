# aws_s3_bucket 
# resource "aws_s3_bucket" "uploaded_files" {


resource "aws_cloudfront_distribution" "s3_distribution" {

  price_class = "PriceClass_All" # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html


  # https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution#viewer-certificate-arguments
  # TODO : may need to update this with a specific certificate over the default
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # origin is going to be s3
  origin {
    domain_name = aws_s3_bucket.uploaded_files.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.uploaded_files.id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.viewall.cloudfront_access_identity_path
    }
  }


  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Some comment"
  default_root_object = "index.html"

  # logging_config (Optional) - The logging configuration that controls how logs are written to your distribution (maximum one).
  #   logging_config { #s3 logging bucket
  #     include_cookies = false
  #     bucket          = "aws_s3_bucket.cloudfront_logs"
  #     prefix          = "uploaded_images"
  #   }

  # no aliases? 
  # aliases (Optional) - Extra CNAMEs (alternate domain names), if any, for this distribution.
  # aliases = ["mysite.example.com", "yoursite.example.com"]



  # default_cache_behavior (Required) - The default cache behavior for this distribution (maximum one).
  default_cache_behavior { # you can do all the http options
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"] # only get and head are cached
    target_origin_id = aws_s3_bucket.uploaded_files.id



    forwarded_values { # forward nothing
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }



  tags = {
    Environment = "dev"
  }


  restrictions {
    geo_restriction {
      locations        = ["US", "AU"] // we only serve to aus and us via this distribution
      restriction_type = "whitelist"

    }

  }

}


resource "aws_cloudfront_origin_access_identity" "viewall" {
  comment = "For not allowing users to see all of S3"
}
