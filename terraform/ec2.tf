# create an ec2 instance
# or (many) in the case of autoscaling
resource "aws_instance" "web" {




  # instance config
  ami                  = "ami-07620139298af599e" # US-EAST-1
  instance_type        = "t2.micro"
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name # UQ instance profile


  # #security group + subnet
  vpc_security_group_ids      = [aws_security_group.allow_ssh.id, aws_security_group.allow_http.id]
  subnet_id                   = aws_subnet.main.id
  associate_public_ip_address = "true"

  #SSH
  key_name = aws_key_pair.deployer.key_name


  # see instance_setup.sh
  user_data                   = templatefile("./instance_setup.sh", { S3 = "${aws_s3_bucket.uploaded_files.bucket}", DB = "${aws_dynamodb_table.uploaded_files.name}", CFRONT = "${aws_cloudfront_distribution.s3_distribution.domain_name}", DB2 = "${aws_dynamodb_table.comments.name}" })
  user_data_replace_on_change = true

  tags = {
    "Name" = "App"
  }


  # bake into the repository being pulled / docker image the actual code for the app



    provisioner "file" {
    source      = "../back/app"
    destination = "/home/ec2-user/app/"
    connection {
      host        = coalesce(self.public_ip, self.private_ip)
      agent       = true
      type        = "ssh"
      user        = "ec2-user"
      private_key = tls_private_key.rsa-4096.private_key_openssh
      # file(pathexpand("~/.ssh/id_rsa"))
    }
  }

  provisioner "file" {
    source      = "./image.jpg"
    destination = "/home/ec2-user/image.jpg"
    connection {
      host        = coalesce(self.public_ip, self.private_ip)
      agent       = true
      type        = "ssh"
      user        = "ec2-user"
      private_key = tls_private_key.rsa-4096.private_key_openssh
      # file(pathexpand("~/.ssh/id_rsa"))
    }
  }
}


####################################################
##        SSH + RSA KEYGEN                        ##
####################################################



# ~/.ssh/ssh-keygen -t rsa -b 4096 -C "your_key_name"
resource "aws_key_pair" "deployer" {
  key_name_prefix = "deploy-key"
  public_key      = tls_private_key.rsa-4096.public_key_openssh
  # file(pathexpand("~/.ssh/id_rsa.pub"))
}


# RSA key of size 4096 bits
resource "tls_private_key" "rsa-4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_sensitive_file" "rsa_key" {
  content  = tls_private_key.rsa-4096.private_key_openssh
  filename = "${path.module}/id_rsa"
}

resource "local_file" "rsa_key_pub" {
  content  = tls_private_key.rsa-4096.public_key_openssh
  filename = "${path.module}/id_rsa.pub"
}