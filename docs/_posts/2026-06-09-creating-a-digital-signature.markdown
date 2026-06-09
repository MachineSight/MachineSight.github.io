---
layout: post
title:  "Classical Computer Vision: Creating a Digital Signature from Written One"
date:   2026-06-09 12:30:55 +0100
permalink: /posts/creating-a-digital-signature
description: "Classical computer vision methods while less referenced today, remains indispensable. This post aims to explain some fundamental techniques in computer vision while building a digital signature utility."
---

<figure style="text-align: center;">
    <p align="center">
        <img src="/assets/images/2026-06/sign-document.gif" width="500"/>
    </p>
</figure>


<br>
In this post, we will build a pipeline that takes written signature images and processes them into transparent digital form that can easily be imported into any documents. In doing so, we learn the following fundamental concepts of image processing and computer vision:

- [Cropping images](#image-cropping-and-changing-color-formats)
- [Changing image color formats](#image-cropping-and-changing-color-formats)
- [Thresholding, masking and segmentation](#thresholding-and-segmentation)
- [Creating alpha channels (4-channel images)](#merging-image-channels)

Some of this concepts might be better described by, and as mathematical operations. However, I have chosen to emphasize practical implementation than mathematical elegance.

<i> **Just a background:** I saw this project while going through my projects' archive. It was one of the hands-on of <a href="https://opencv.org/university" target="_blank" rel="noopener noreferrer">OpenCV university courses.</a> Immediately, I was reminded of how it has taught me some of the basic concepts of computer vision. Then I asked, why not write a blog post on it? And, here we are! </i>

### Install Python libraries
We require only two libraries installed on your python environment:

1. OpenCV (version 4): A widely popular computer vision library with vast number of algorithms and tools. It is the workhorse of the entire digital signature pipeline.

2. Matplotlib: A scientific programming library mostly used for data plotting and visualization. 

Obviously, we will use OpenCV to perform operations on our image, and Matplotlib to display it. To install these tools, open a command line, then type/paste the following

```
pip install opencv-python==4.13.0.92 matplotlib
```

To check if installation was successful, you can type the following in the command-line

```
python -c "import cv2; print('OpenCV:', cv2.__version__)"
```

```
python -c "import matplotlib as mat; print('Matplotlib:', mat.__version__)"
```

The version numbers should be displayed accordingly.

### Load and display the image

To begin processing, we properly import the installed libraries and load the written signature image into memory with OpenCV, also displaying it using Matplotlib pyplot.

```
import cv2
import matplotlib.pyplot as plt

%matplotlib inline      # configuration for use in Jupyter notebooks
plt.rcParams['figure.figsize'] = (6.0, 6.0)
plt.rcParams['image.cmap'] = 'gray'
```
Now, we load the image file named *written-signature.jpg* from the current working directory or path. The image has been loaded in the full color RGB format. Actually, BGR because opencv reverses the RGB channels and read it as a BGR array. Thus, we have included the array reverse indexing in the plt.imshow() command.

```
# Read the image.
img_path = 'written-signature.jpg'
sig_org = cv2.imread(img_path, cv2.IMREAD_COLOR)

# Display the image using imshow() so we can see the size with axis
# also reverse the image array to avoid unexpected display in color
plt.imshow(sig_org[:, :, ::-1])
plt.title('Sample Signature')
```
You should get an output like this:

<img src="/assets/images/2026-06/signature.jpg" width="500"/>

As seen, we need to remove excess white spaces around the signature. Also, the image has low contrast. While it depends on the situation, we may need to adjust the contrast or crop the image to remove shadows/excess whitespaces, and have a better output to be easily imported in documents.

### Image Cropping and Changing Color Formats
We crop the image from 700 to 1500 pixels on the vertical axis, and from 500 to 2500 pixels on the horizontal axis. This is implemented in the code below:

```
sig = sig_org[700:1500, 500:2500, :]
plt.imshow(sig[:, :, ::-1]);
```

<img src="/assets/images/2026-06/signature-cropped.jpg" width="500"/>

As a step to segment the signature from the background by thresholding, we convert the cropped image to 1-channel grayscale image. Then, we can apply our thresholding technique.

```
sig_gray = cv2.cvtColor(sig, cv2.COLOR_BGR2GRAY)
plt.imshow(sig_gray)
plt.title('Gray scale Output');
```

<img src="/assets/images/2026-06/signature-gray.jpg" width="500"/>

### Thresholding and Segmentation
In thresholding, we choose a value (called threshold), and perform comparison of this value with every pixel of the image. If any pixel intensity is greater than this value, we replace it with a constant number (usually 255), otherwise, we also replace it with another value (usually 0). Such that we have a new image output with only two pixel intensities (0 and 255); a binary image. This binary image is also called a mask, specifically *alpha mask* in our case, as this eventually becomes the alpha-channel.

Here is how this is done with OpenCV:

```
# Thresholding with threshold=100, and max-value=255
ret, alpha_mask = cv2.threshold(sig_gray, 100, 255, cv2.THRESH_BINARY_INV)
plt.imshow(alpha_mask)
plt.title('Alpha Mask');
```

<img src="/assets/images/2026-06/signature-alpha-mask.jpg" width="500"/>


After some experimentation, I have suitably selected a threshold of 100. You may need to adjust this to obtain an optimal one. It is worth mentioning that there is a concept of *adaptive thresholding* without using a hard-coded threshold. Its operation is a little different from this thresholding technique. I have not used it here because it's output was extremely noisy during my experimentation. 

Note that, we have performed an inverse operation here. That is, pixels lower than 100 becomes 255, and those above becomes 0. That is the reason why the regions of the written signature is fully white, and the background is entirely black. 
Counterintuitive, it may seem, that our once white background now becomes black.

With our mask ready, we can now merge it with the R, G, and B channels of our cropped image.

### Merging Image Channels
We merge the RGB-channels with the mask to produce a 4-channel image with transparency information. The transparency information is held in the alpha-mask. In real sense, the alpha channel has values ranging from 0 to 255 just like other channels. 0 represents complete transparency; 255 represents full opacity. Values in-between represents partial transparency. However, to allow for full background transparency and full signature-area opacity, we have used only 0 and 255 respectively.

To do this, we split the cropped signature image into corresponding RGB channels. Then, merge them with the alpha mask to have the final output.

```
# Split the color channels from the cropped image.
b, g, r = cv2.split(sig)
```

The variables b, g, and r are arrays the hold each channel information.

```
# Create a list of the four arrays with the alpha channel as the 4th member
channel_list = [b, g, r, alpha_mask]

# Using the OpenCV merge() function
merged_img = cv2.merge(channel_list, 4)

# Save the transparent signature a PNG file with alpha channel support
cv2.imwrite('digital_sig.png', merged_img)
```

<figure style="text-align: center;">
    <p align="center">
       <img src="/assets/images/2026-06/digital_sig.png" width="400"/>
    </p>
    <figcaption> Final output: digital_sig.png </figcaption>
</figure>

<br>
The file *digital_sig.png* in the current working directory is the final output which can be imported into PDF documents or uploaded online as part of bio-data.

Check out this <a href="https://github.com/MachineSight/e-Signature" target="_blank" rel="noopener noreferrer">GitHub repo</a>  for a simple desktop utility with GUI that allows you select the signature image file and save the digital signature in a desired location.