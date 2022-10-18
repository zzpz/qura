output "db1-uploaded" {
  value = aws_dynamodb_table.uploaded_files.arn

}

output "db2-comments" {
  value = aws_dynamodb_table.comments.arn

}

output "url" {
  value = aws_instance.web.public_dns
}

output "ip" {
  value = aws_instance.web.public_ip
}

output "s3_admin_policy" {
  value = data.aws_iam_policy_document.s3_policy_doc.json
}

output "dynamo_crud_policy" {
  value = data.aws_iam_policy_document.dynamodb_crud_policy_doc.json
}

output "dynamo_admin_policy" {
  value = data.aws_iam_policy_document.dynamodb_admin_doc.json
}

output "ssh_string" {
  value = "ssh -i ./id_rsa ec2-user@${aws_instance.web.public_dns}"
}

output "scp_string" {
  value = "scp -i ./id_rsa  -r ./image.jpg ec2-user@${aws_instance.web.public_dns}:~/image.jpg"
}

output "s3" {
  value = aws_s3_bucket.uploaded_files.bucket_domain_name
}

resource "local_file" "cmds" {
  content  = "ssh -i ./id_rsa ec2-user@${aws_instance.web.public_dns} \n scp -i ./id_rsa  -r ./image.jpg ec2-user@${aws_instance.web.public_dns}:~/image.jpg \n aws s3 cp ./image.jpg $S3"
  filename = "${path.module}/cmds"
}
