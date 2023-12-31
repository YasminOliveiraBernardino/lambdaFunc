//O trigger do lambda precisa estar conectado a SQS, com suas devidas permissões. Eu utilizei todas as permissões afim de economizar tempo. Também permiti tudo no DynamoDB. 

const aws = require('aws-sdk');

const dynamoDB = new aws.DynamoDB.DocumentClient({
    region:'us-east-2',
    apiVersion:'2012-08-10'
});

exports.handler = async (event) => {
  try{
      
      console.log('event: ', event);
      
      const { Records } = event;
      
      const body = JSON.parse(Records[0].body); 
      
      console.log("Incoming message body from SQS :", body); 
          
      const params = {
         TableName:'demo-table1',
         Item: {
            idempotencyId : body.idempotencyId,
            Amount : body.Amount,
            Type : body.Type
         }
       }; 
      
       await dynamoDB.put(params).promise();
      
       console.log('Successfully written to DynamoDB');
     
  } catch(error){     
      console.error('Error in executing lambda: ', error);
      return {"statusCode": 500, "message:": "Error while execution"};
  }
};
