---
layout: post
title:  "On Learning Representations: How Artificial Intelligence Sees The World"
date:   2026-08-10 12:30:55 +0100
permalink: /posts/on-learning-representations
description: "This post is about the foundations of learning, and useful representations that aids an AI algorithm to understand underlying patterns."
---


Have you ever wondered how you can follow the plot of a movie series, even with each episode watched a significant interval apart, without perfectly recalling each scene, act or all actors? If you have, this is representation at work. It is the ability to condense bulky data into sparse form that remains faithfully suffice to represent the whole.

In this essay, we discuss in clear terms, how patterns in data are down-stripped to what's relevant, and how the resulting representations can be encoded only as two variables which are learned by DL-based AI models.

<br>
<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-08/test-cup1-labeled.jpg" alt="cup-image" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
  <figcaption style="margin-top: 0.75rem; text-align: center;">
    A cup labelled by an image classification model with 97% confidence score.
    <br>
    Source code @
    <a href="https://www.github.com/MachineSight/cup-classifier" target="_blank">MachineSight</a>
  </figcaption>
</figure>
<br>

For an input image (say of a cup) to an image classification model, it looks amazing getting the output correctly labelled as a cup. However, most properties of the object appearing in the image may be insignificant to inferring basic information about what it is. What then matters? Is it the color of the object? Its' orientation or content? Surrounding context?

The answer seems obvious for our case study of a cup. It is none of the highlighted. An image classification model does not need to know it's color or location. Clearly, there are infinite possibilities for these properties. Rather, it does need to understand its' geometry and shape; an implicit knowledge of how the handle is held by the body which tapers symmetrically from the rim to the base. All these are the important features definitely to be considered to give the most basic information of what an object is (a cup).


<br>
<figure style="text-align: center; margin: 0 auto; max-width: 100%;">
  <div style="display: flex; justify-content: center; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
    <img src="/assets/images/2026-08/test-cup2-labeled.jpg" alt="Cup classified as cup" style="width: min(100%, 360px); height: auto; display: block;" />
    <img src="/assets/images/2026-08/test-cup2_smoothgrad.png" alt="SmoothGrad explanation for cup classification" style="width: min(100%, 360px); height: auto; display: block;" />
  </div>
  <figcaption style="margin-top: 0.85rem; text-align: center; max-width: 900px; margin-left: auto; margin-right: auto;">
    A hand-sketch of a cup correctly classified with 68% confidence. The image on the right is a SmoothGrad visualization that highlights the regions driving the model's prediction; a proof of the discourse above.
    <br> Source code @
       <a href="https://www.github.com/MachineSight/cup-classifier" target="_blank"> MachineSight </a>
  </figcaption>
</figure>
<br>


A basic shape may serve to produce information on what an object is. However, to give insightful information as to its' current state and complex physical descriptions, there is a need for a bigger representation than can be captured by its geometry alone, more than it would take to simply classify it; possibly including the cup's color, orientation, or surrounding context as earlier mentioned.

Thus, it is plain that if more output information is required, then a denser representation space is needed. This agrees with how we have successfully pushed AI performance to its current state through the Scaling Law - bigger is better.

### A View of Neural Networks' Weights and Biases

Suppose we have five sets of input and output pairs denoted by (input, output) as our data:

$$\left\{(2, 9), (3, 11), (5, 15), (7, 19), (8, 21)\right\}$$

In algebraic terms, we define our datasets as $(x, y)$ where x is the input, and y is the output. Below is a plot of these data points for visualization.

<br>
<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-08/plot-points.jpg" alt="data-points" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
</figure>
<br>

Now, our goal is to find a minimal representation that is able to describe these data points. For this, we do a bit of algebra, and geometry. By eyeballing the points, we can surmise they lie on a straight line. And by the equation of a straight line: $y=mx+c$ where $m$ is the line slope and $c$ is the y-intercept.

From our data points, we calculate m and c as:

$$
\begin{aligned}
m &= 2 \\
c &= 5
\end{aligned}
$$

Therefore, for our dataset, $y=2x+5$.

<br>
<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-08/plot-with-line.jpg" alt="plot with line" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
  <figcaption style="margin-top: 0.75rem; text-align: center;">
    Plot showing data points fitted on the line described by values of m and c.
  </figcaption>
</figure>
<br>

  <p align="center"> <i> We could have trained a neural network on our dataset, and we will have had the same result. However, it would have been a waste of compute. </i> </p>

From the chain of thought we have built so far, we see that this is more than an equation; it is a simple representation form for our so-called large dataset. That is, we have stripped down the collection of input-output pairs into just two constants, $m$ and $c$, that remains true equivalent to them.

Interestingly, with this model, we can have answers to questions like "what lies beyond what our dataset captures?"; "To a given input, what will be the output?" (Of course, assumption is made herein for continuous unbounded inputs and outputs). In short, we can extrapolate our datapoints with this new form of representation. That is another strength of learning representations.

<br>
<figure style="margin: 0; width: 100%; text-align: center;">
  <img src="/assets/images/2026-08/plot-unknown.jpg" alt="plot with an unknown" style="display: block; margin: 0 auto; max-width: 100%; max-height: 62vh; width: auto; height: auto;" />
  <figcaption style="margin-top: 0.75rem; text-align: center;">
    Plot showing data points with a distant unknown that can be determined from this model.
  </figcaption>
</figure>
<br>


From this, it is safe to say that with AI advancement, new discoveries will be more abundant than what we have seen so far. I hope that by making this statement I am not running ahead of myself!

To concretely relate with neural networks, we simply rename $m$ and $c$ to **weights** and **biases** respectively. As a matter of fact, nodes before activation in neural networks have the same form as our straight line equation. The input is "weighted" by some value, and a bias is added to "nudge" the output. The cumulative effects of hundreds and thousands of these two variables along with many inputs is what makes DL-based models revolutionary.

$$
\begin{aligned}
y = \sum W_nx_n + b
\end{aligned}
$$

<p align="center"> <i> This is a weighted sum across n-inputs with a bias for a single node in a neural network. </i> </p>

Fair enough for an illustration, our toy example requires that we compute only two values (m and c), but it becomes a problem when we have hundreds of them. Therefore, it is reasonable to ask, **How do we obtain optimal values for these collection of numerous weights and biases across large data samples available?** This is exactly what happens during model training.

The answer resides with an algorithm called **Backpropagation** together with techniques of **Gradient Descent**. I choose to leave out rigorous mathematical details to strike curiousity for less-technical readers. However, I give a loose explanation.

At first, we initialize the weights and biases of our network with random values, then we pass our labelled data through them to get an output. Because we started with random parameters, this predicted output will be off the expected target by a metric we define - loss function. Through the math of derivatives, this error (called loss) at output is "sent" back to every weights and biases in the network to determine how much they have contributed to it. This is what **Backpropagation** does.

The contribution of each weight and bias to the error is their derivative or gradients with respect to the loss function. An optimizer is used to remove this change from each weight/bias parameter so that the loss reduces. This is what **Gradient Descent** does.

These algorithms are like two sides of a coin, and are performed many times over (called epochs) to get the loss asymptote at zero. 

Many pages of comprehensive books have been dedicated to these concepts. That is, two paragraphs are barely a gist of what is actually happening. Thus, this deserves to be the subject of a future post. Anyway, for a post about simple representation itself, I feel no guilt giving such concise explanation.

The next time you feel overwhelmed by the weight of facts or the bias of decisions, ask yourself of the most fundamental detail everything else rests on, whose knowledge unites every piece of given data. This is what AI does, and indeed, machines have a lot to teach us about ourselves. 

<div style="margin-top: 3rem; padding-top: 1rem; border-top: 1px solid rgba(127, 127, 127, 0.35); text-align: center; font-size: 0.95rem; line-height: 1.6; opacity: 0.92;">
  <p style="margin: 0;">
    The source code at
    <a href="https://www.github.com/MachineSight/cup-classifier" target="_blank">MachineSight</a>
    includes the dataset, model training, and evaluation pipeline scripts, along with Grad-CAM and SmoothGrad visualization scripts.
  </p>
</div>