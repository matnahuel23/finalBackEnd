const nodemailer = require('nodemailer');
const config = require('../config/config.js');
const userMail = config.userMail;
const passMail = config.passMail;
const productsService = require ("../dao/factory/product.factory.js");
const transport = nodemailer.createTransport({
  service: 'Gmail',
  port: 587,
  auth: {
    user: userMail,
    pass: passMail,
  },
  tls: {
    rejectUnauthorized: false
  }
});

function sendEmail(email, mensaje, subject, attachments = []) {
  if(!subject)
  {
    subject = 'Ecommerce MATIAS N. IERACE'
  }
  const mailOptions = {
    from: `Ecomerce <${userMail}>`,
    to: email,
    subject: subject,
    html: mensaje,
    attachments: attachments.map(attachment => ({
      filename: attachment.filename,
      content: attachment.content, // Puedes modificar esto según la estructura de tus documentos
      encoding: 'base64',
    })),
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
}

async function generateEmailContent(code, products, total) {
  const productDetails = [];

  for (const product of products) {
    const productDetail = await productsService.getProductById(product.product);

    if (productDetail) {
      productDetails.push({
        title: productDetail.title,
        quantity: product.quantity,
        price: productDetail.price,
      });
    }
  }

  let emailContent = `
Su compra se realizó correctamente.<br><br>
<b>Número de código:</b> <strong>${code}</strong><br><br>
<b>Listado de productos:</b><br>
<ul>`;

  for (const product of productDetails) {
    emailContent += `
<li>${product.title} x${product.quantity} $${product.price * product.quantity}</li>`;
  }

  emailContent += `
</ul><br>
<b>Total gastado:</b> <strong>$${total}</strong><br><br>
Gracias por su compra!`;

  return emailContent;
}

async function sendResetPasswordEmail(resetPasswordLink) {
  let emailContent = `
  Recibimos un pedido para actualizar su contraseña.<br><br>
  <b>Ingrese al siguiente vinculo para restablecerla:</b> <strong>${resetPasswordLink}</strong><br><br>
  <b>Si usted no hizo el pedido no haga nada</b><br>
  <b>Gracias por utilizar este Ecommerce</b><br>
  `;

  return emailContent;
}

module.exports = { generateEmailContent, sendEmail, sendResetPasswordEmail };
