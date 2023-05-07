const cloudinary = require('cloudinary').v2;


cloudinary.config({ 
    cloud_name: "di91vglla", 
    api_key: 356236776525671, 
    api_secret: "wsL3PTkAWt_UPrMTzZvalI6jiDQ"
  });

  module.exports= cloudinary;