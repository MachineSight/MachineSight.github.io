---
layout: post
title:  "Camera Parameters and Image Formation"
date:   2026-09-24 12:30:55 +0100
permalink: /posts/the-science-behind-image-formation
description: "In this post, we delve into the fundamentals of how a 3D world is transformed to a flat 2D image. We also discuss the geometrical relationships and principles underlying such mapping, and lay a solid foundation for understanding 3D reconstruction and its broader applications."
---

<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-09/intro-img.png" alt="render of a 3d reconstructed vehicle point-cloud" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
  <figcaption style="margin-top: 0.75rem; text-align: center;">
    A 3D reconstruction showing a vehicle's point-cloud and camera positions.
  </figcaption>
</figure>
<br>


In an <a href="https://machinesight.github.io/posts/what-images-really-are" target="_blank">earlier post</a>, we discussed what images really are, their classes, and composition. The post was established from the stand-point of a computer performing operations on them, not of the camera. Things however, become more interesting as we understand the transformation of the 3D world into a 2D image.

Light from natural and artificial sources illuminates our world. These light rays reflect off objects, and change properties in a unique way as they interact with objects. Our eyes (and imaging cameras) observe these changes to perceive color, brightness, and depth, or form images.

Images are all around us. As reflected light falls on surfaces, they form a projection of the object from which it was reflected. These images, however, becomes less clear as light bounced off other objects interferes with one another.
To obtain a comprehensible image, we therefore need to constrain the amount of light allowed to fall on our image plane. This leads to the concept of pinhole camera.

## Pinhole Camera

The pinhole camera is the simplest and fundamental camera model. Physically, it is a light-tight box with an aperture (small opening) that projects an inverted image onto the opposite inner wall called the image plane. The inversion is not only a pinhole camera artifact, it is generally a phenomenon of any camera model. Logically, we can take the inverted image (real image plane), rotate it 180°, and place it at exactly the same distance in front of the camera aperture. This transformed image plane is called the **virtual image plane**.


<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-09/pinhole-camera.png" alt="pinhole camera" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
  <figcaption style="margin-top: 0.75rem; text-align: center;">
    Pinhole camera model with real and virtual image planes.
  </figcaption>
</figure>
<br>


Concretely, the pinhole camera model describes the mathematical relationship between the coordinates of a point in three-dimensional space and its corresponding projection on the image plane. Because the pinhole camera uses no lens, its model does not account for optical distortions or skew caused by lens. This is the main difference between pinhole camera model and other camera models (e.g thin lens model). It is therefore an ideal camera, hence, we use it throughout our analysis in this post.

In general, a camera describes the mapping between the three-dimensional space coordinates of a point and it's correspondence on a two-dimensional virtual image plane.

There are two key parameters to watch out for as this mapping occurs. One is about transforming the world coordinate of the point being measured to the camera coordinate. Both the world and camera coordinates are three-dimensional.

The second is about expressing the camera coordinate system in the virtual plane image coordinate. We call these the **Extrinsic** and **Intrinsic** camera parameters respectively.

## Extrinsic Camera Parameters

For a point $P$ in the world coordinate system $W$ (you can think of $P$ as for example, the key hole on a room door, and the world coordinate as the floor corner of the room, both are arbitrary), a camera with pinhole center $O_c$ placed in the scene is obviously at a point away (translation, $t$) from $W$ (again, $W$ is the *ground* or reference for point (or points) $P$; both are arbitrary). The camera coordinate at $O_c$ can also be oriented differently from $W$. This translation $\mathbf{t}$ and rotation $\mathbf{R}$ (described as orientation) are the two components of the extrinsic parameters needed to express $P$ in the camera coordinate system.

<br>
<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-09/world-camera-coordinates.png" alt="world to camera coordinates" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
  <figcaption style="margin-top: 0.75rem; text-align: center;">
   From world coordinate to camera coordinate.
  </figcaption>
</figure>
<br>


- $W$ has boldface axes ($\mathbf{X_w}$, $\mathbf{Y_w}$, $\mathbf{Z_w}$)
- $P$ in world coordinate system is ($X_w$, $Y_w$, $Z_w$)
- $P$ expressed in camera coordinate system as ($X_c$, $Y_c$, $Z_c$)
- Camera at $O_c$ has boldface axes ($\mathbf{X_c}$, $\mathbf{Y_c}$, $\mathbf{Z_c}$)

The operation to bring into the camera coordinate system from the world's is performed by a 3x3 matrix of rotation of each axis, $\mathbf{R}$ and a 3x1 vector of the translation of each axis, $\mathbf{t}$.

$$
\begin{bmatrix} 
X_c \\ Y_c \\ Z_c 
\end{bmatrix} 
= \mathbf{R} 
\begin{bmatrix} 
X_w \\ Y_w \\ Z_w 
\end{bmatrix} 
+ \mathbf{t}
$$

To rewrite this equation in a compact way, we join vector $\mathbf{t}$ to $\mathbf{R}$ such that $\mathbf{t}$ becomes the last column of the resulting 3x4 matrix, and we turn $P$ in the world coordinate system into homogeneous vector by appending 1 to it (this also makes the matrix multiplication valid).

$$
\begin{bmatrix} 
X_c \\ Y_c \\ Z_c
\end{bmatrix} 
= \mathbf{[R | t]} 
\begin{bmatrix} 
X_w \\ Y_w \\ Z_w \\ 1
\end{bmatrix} 
$$

The 3x4 matrix $\mathbf{[R \| t]}$ is the **Extrinsic parameter** containing the rotation and translation of the camera with respect to the world coordinate system. In other words, the extrinsic parameters describe the camera's pose relative to a chosen world coordinate system.


<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-09/camera-extrinsic.jpeg" alt="camera extrinsics" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
  <figcaption style="margin-top: 0.75rem; text-align: center;">
    Extrinsic details of a camera.
  </figcaption>
</figure>
<br>


## Intrinsic Camera Parameters

Now that we have $P$ expressed in the view space where the camera sits at the origin, we need a step further to transform it to coordinates on the image plane. 


<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-09/camera-image-coordinates.png" alt="camera intrinsics" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
  <figcaption style="margin-top: 0.75rem; text-align: center;">
   From camera coordinate to image-plane coordinate.
  </figcaption>
</figure>
<br>

Using similar triangles, the relationship between the point in image-plane coordinates and it's 3D camera coordinate is:

$$ 
x = f {X_c \over Z_c} \ \ , \ \ \ \ y = f {Y_c \over Z_c}
$$

where $f$ is the distance between the image plane and the camera projection centre.

By multiplying both equations by Z and expressing them together, we obtain:

$$ 
Z_c\ x = f {X_c} \ \ \ , \ \ \  Z_c\ y = f {Y_c} 
$$

$$
Z_c
\begin{bmatrix} 
x \\ y \\ 1
\end{bmatrix} 
= 
\begin{bmatrix}
f & 0 & 0 \\
0 & f & 0 \\
0 & 0 & 1 
\end{bmatrix} 
\begin{bmatrix} 
X_c \\ Y_c \\ Z_c
\end{bmatrix}
$$

Thus, the image-plane coordinate;

$$
p = 
\begin{bmatrix} 
x \\ y \\ 1
\end{bmatrix} 
$$

However, this is not the end of the story as the digital image-plane is represented as pixel coordinates, not in conventional units (e.g, mm). Also, we have only expressed the ideal pinhole projection in matrix form.

We must account mainly for focal length expressed in pixels, and the principal point.

Our projection equation now becomes:

$$
u = f_x{X_c \over Z_c} + c_x \ \ , \ \ v = f_y{Y_c \over Z_c} + c_y 
$$

- $u$ and $v$ are the horizontal and vertical image coordinates in pixels respectively
- $f_x$ and $f_y$ are the horizontal and vertical focal lengths respectively (in pixels)
- $c_x$ and $c_y$ are the principal point coordinates - the pixel location where the optical axis intersects the image plane.

By combining these equations like we've done earlier, we have:

$$
Z_c
\begin{bmatrix} u\\v\\1 \end{bmatrix}
=
\underbrace{
\begin{bmatrix}
f_x & 0 & c_x\\
0 & f_y & c_y\\
0 & 0 & 1
\end{bmatrix}
}_\mathbf{K}
\begin{bmatrix} X_c\\Y_c\\Z_c \end{bmatrix}
$$

**$K$ is the intrinsic parameter matrix** that maps the point $P$ in the camera coordinate to correspoint point $p$ in the image (pixel) coordinate.

$$
P =
\begin{bmatrix} X_c\\Y_c\\Z_c \end{bmatrix}
\quad\longrightarrow\quad
p =
\begin{bmatrix} u\\v \end{bmatrix}
$$



<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-09/camera-image-pixel-coordinate.png" alt="camera intrinsics" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
  <figcaption style="margin-top: 0.75rem; text-align: center;">
   From camera coordinate to pixel image-plane coordinate.
  </figcaption>
</figure>
<br>



Interestingly, this is where we lose depth $Z_c$ because same points but with multiples of $Z_c$ gets mapped to a single image-pixel coordinate. We therefore can replace $Z_c$ with an arbitrary constant or remove it completely (it is indefinitive).

## Projective Matrix
The projective matrix is simply the combination of both the intrinsic and extrinsic matrices. Recall that the whole pipeline for taking a point in the world-coordinate through the camera-coordinate to the image-pixel coordinate is:

$$
p = 
\begin{bmatrix} u\\v\\1 \end{bmatrix} = 
\underbrace{\mathbf{K \ [R | t]}}_\mathbf{Projective\ matrix}
\begin{bmatrix} X_w\\Y_w\\Z_w\\1 \end{bmatrix}
$$

Projective matrix as we see, $\mathbf{P} = \mathbf{K \ [R \| t]}$, combines the intrinsic and extrinsic matrices to bring a point represented from world coordinates to image pixel coordinates.

We have shown that projecting a 3D point in world coordinate system to camera pixel coordinates is done in two main steps. This is essential to have a solid understanding of Structure from Motion (SfM), SLAM, point tracking, camera calibration, and numerous applications. In future posts, we will explore in-depth some of the many applications of this concept. I hope you enjoyed reading!

### Useful Resources 
1. Richard Hartley and Andrew Zisserman (2003). *Multiple View Geometry in Computer Vision*.
2. Satya Mallick (2020). *Geometry of Image Formation*. URL: <https://learnopencv.com/geometry-of-image-formation>