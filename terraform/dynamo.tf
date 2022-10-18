resource "aws_dynamodb_table" "uploaded_files" {
  name = "uploaded-files-${random_pet.pet_name.id}"

  read_capacity  = 20
  write_capacity = 20

  hash_key  = "ImageID"
  range_key = "DateAdded"

  # server_side_encryption
  server_side_encryption { #TODO: review
    enabled = "true"
  }

  attribute {
    name = "UserID"
    type = "S"
  }

  # from cloudfront
  attribute {
    name = "ImageID"
    type = "S"
  }

  attribute {
    name = "DateAdded"
    type = "S" # date added
  }

  # attribute { #unindexed
  #   name = "ImageName"
  #   type = "S" #name of the file
  # }


  local_secondary_index {
    name            = "DateByImage"
    range_key       = "DateAdded"
    projection_type = "ALL"
  }

  local_secondary_index {
    name            = "UserByImage"
    range_key       = "UserID"
    projection_type = "ALL"
  }


  tags = {
    "Name" = "Uploaded Files DB"
  }
}


resource "aws_dynamodb_table" "comments" {
  name = "users-uploaded-files-${random_pet.pet_name.id}"

  read_capacity  = 20
  write_capacity = 20

  hash_key  = "UserID"
  range_key = "DateAdded"

  # server_side_encryption
  server_side_encryption { #TODO: review
    enabled = "true"
  }

  # from uploaded_files db

  attribute {
    name = "UserID"
    type = "S"
  }

  # attribute {
  #   name = "ImageID"
  #   type = "S"
  # }

  attribute {
    name = "DateAdded"
    type = "S"
  }

  local_secondary_index {
    name            = "ImagesByDateByUser"
    range_key       = "DateAdded"
    projection_type = "ALL"
  }

  # local_secondary_index {
  #   name            = "Image"
  #   range_key       = "ImageID"
  #   projection_type = "ALL"
  # }

}

