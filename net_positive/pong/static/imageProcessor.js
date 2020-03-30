"use strict";

class ImageProcessor {
  constructor() {
    this.regex80 = /00000000000000000000000000000000000000000000000000000000000000000000000000000000/gi
    this.regex40 = /0000000000000000000000000000000000000000/gi
    this.regex20 = /00000000000000000000/gi
    this.regex10 = /0000000000/gi
    this.regex4 = /1111/gi
    this.regexW = /wwwwwwwwwwwwwwwwwwww/gi
  }

  retrievePixelData(context) {
    var image = context.getImageData(0, 0, 320, 320);
    var imageArray = Array.from(image.data);
    imageArray = this.rgbaToBinary(imageArray);
    var imageString = imageArray.join('');
    imageString = this.compressString(imageString);
    return imageString;
  }

  rgbaToBinary(imageArray) {
    imageArray = imageArray.filter(function(_, i) {return (i + 1) % 4})
    imageArray = imageArray.filter(function(_, i) {return (i + 1) % 3})
    imageArray = imageArray.filter(function(_, i) {return (i + 1) % 2})

    for (var i = 0, len = imageArray.length; i < len; i++) {
      imageArray[i] < 127 ? imageArray[i] = 0 : imageArray[i] = 1;
    }
    return imageArray;
  }

  compressString(imageString) {
    //first round of compression
    imageString = imageString.replace(this.regex80, 'w');
    imageString = imageString.replace(this.regex40, 'x');
    imageString = imageString.replace(this.regex20, 'y');
    imageString = imageString.replace(this.regex10, 'z');
    imageString = imageString.replace(this.regex4, 'a');
    // second round of compression
    imageString = imageString.replace(this.regexW, 'v');
    return imageString;
  }

}