workspace {
    model {
        user = person "User"
        historian = person "Historian"
        cognito = softwareSystem "AWS Cognito"{
            tags "Amazon Web Services - Cognito"
        }
        
        s3 = softwareSystem "AWS S3"{
            tags "Amazon Web Services - Simple Storage Service S3"
        }
        
        dynamo = softwareSystem "AWS DynamoDB"{
            tags "Amazon Web Services - DynamoDB"
        }
        
        cloudfront = softwareSystem "AWS Cloudfront"{
            tags = "Amazon Web Services - CloudFront"
        }
        
        url = softwareSystem "App Endpoint"{
            tags "Amazon Web Services - EC2 Elastic IP Address"
        }

        qura = softwareSystem "QURA app" {
        
            frontend = container "React SPA"{
                description "Static webapp that provides User Interface to the application"
                technology "React.js"
            }
            

            backend = container "QURA API"{
                description "Delivers the SPA and performs actions relating to items"
                technology "Networked Docker Containers"

                group "Networked Docker Images"{
                nginx = component "HTTP Server" "A reverse Proxy to the API" "Nginx"
                certbot = component "SSL Certificate Signer" "Automates SSL certificate signing and renewal via letsEncryp" "Certbot"
                api = component "Backend API" "The application logic for CRU(D*) operations" "Node.js"
                }
            
                SPA = component "ReactBrowser" "The compiled SPA served to the browser" "React, Javascript"
                localenv = component "Sensitive data" ".env,ssl cert,keys used by the API" "files" 

                url -> nginx "forwards requests"
                nginx -> certbot "Retrieves SSL certificate"
                nginx -> api "Forwards incoming requests as HTTPS"
                api -> nginx "Returns response from attempting to perform actions on resources"
                api -> s3 "Uploads files to storage"
                api -> dynamo "Creates,Reads and Updates file Info"
                api -> localEnv "Uses mapped local files/env variables"
                api -> frontend "Generates and provides signed cookies to authenticated and authorised users"
                certbot -> localenv "Stores certificate"
                
                api -> SPA "Serves to any unknown requested path"
            } 

            frontend -> cognito "User signup, sign-in and attribute management JWT"
            frontend -> cloudfront "Requests private files (with credentials - signed cookies)"
            
            s3 -> cloudfront "Loads files to CDN"
            s3 -> frontend "Provides publicly available files"
            
            frontend -> url "Makes requests to alter and retrieve file info"
            frontend -> url "Requests credentials to access Cloudfront files"
            frontend -> s3 "Requests files"
            
            cloudfront -> frontend "Refuses due to CORS? issues 😔"
        }



        user -> qura "Browses files and makes comments"
        historian -> qura "Uploads & describes Items, views and processes comments"
        backEnd -> frontend "Delivers SPA to user's web browser"   
            

        qura -> s3 "Uploads files"
        qura -> dynamo "Creates Reads Updates Items"
        qura -> cognito "Authorises and Authenticates Users"
        qura -> s3 "Requests files for display"
        qura -> cloudfront "Requests files for display with credentials"
        
        
        
        live = deploymentEnvironment "Live" {
            
            deploymentNode "Amazon Web Services" {
                tags "Amazon Web Services - Cloud"
                
                deploymentNode "AWS Cognito" {
                    tags "Amazon Web Services - Cognito"
                    auth = softwareSystemInstance cognito
                }
                
                deploymentNode "AWS DynamoDB" {
                    tags "Amazon Web Services - DynamoDB"
                    database = softwareSystemInstance dynamo
                }

                deploymentNode "AWS S3" {
                    tags "Amazon Web Services - Simple Storage Service S3"
                    storage = softwareSystemInstance s3
                }

                deploymentNode "ElasticIP" {
                    tags "Amazon Web Services - EC2 Elastic IP Address"
                    static_ip = softwareSystemInstance url
                    
                }
                
                deploymentNode "AWS Cloudfront" {
                    tags "Amazon Web Services - CloudFront"
                    cfront = softwareSystemInstance cloudfront
                }

                region = deploymentNode "AP-South-1" {
                    tags "Amazon Web Services - Region"
                
                    vpc = deploymentNode "VPC" {
                            tags "Amazon Web Services - Virtual private cloud VPC"
    
    
                    ec2 = deploymentNode "Amazon EC2" {
                            tags "Amazon Web Services - EC2"
                            
                            deploymentNode "ARM64 Amazon Linux Server" {
                                app = containerInstance backend
                            }
                        }
                    }
                }
            }
            

            deploymentNode "UsersBrowser" {

            
             
                deploymentNode "QURA FrontEnd App"{
                    browser = containerInstance frontend
                }
            }
            
            deploymentNode "Browser or Desktop" {
            post = infrastructureNode "Postman API Platform"{
                    
            }
            }
        }
        
        post -> cfront "Request file with signed cookies"
        cfront -> post "Return authorised file"
    }

    views {

        systemContext qura {
            include *
            autoLayout lr

        }
        
        container qura {
            include *
            autoLayout lr
        }
        
        component backend {
            include *
            autoLayout lr
        }
        
        deployment * live {
            include *
        }


        theme https://static.structurizr.com/themes/amazon-web-services-2020.04.30/theme.json
    }
}