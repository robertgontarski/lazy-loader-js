# LazyLoader Documentation

## Overview

LazyLoader is a utility class that uses the Intersection Observer API to efficiently lazy load elements when they become visible in the viewport. It provides a simple interface for observing elements and triggering callbacks when they enter the viewport, with additional support for callbacks before and after unobserving elements.

## Features

- Lazy loading of elements when they become visible
- Configurable threshold and root margin
- Callbacks before and after unobserving elements
- Simple API for observing and unobserving elements
- Efficient management of observers

## Installation

### Via jsDelivr CDN

You can include LazyLoader directly from jsDelivr CDN:

```html
<!-- latest version -->
<script src="https://cdn.jsdelivr.net/gh/robertgontarski/lazy-loader-js@master/lazyLoader.js"></script>

<!-- minify version -->
<script src="https://cdn.jsdelivr.net/gh/robertgontarski/lazy-loader-js@2bcf703daef729338d4d26beaa646e6129ea14f2/lazyLoader.min.js"></script>
```

## Usage

### Basic Usage

```javascript
// Create a new LazyLoader instance
const lazyLoader = new LazyLoader();

// Observe an element
const element = document.querySelector('.lazy-element');
lazyLoader.observe(
    (entry) => {
        // This callback is called when the element becomes visible
        console.log('Element is visible!', entry.target);

        // Perform your lazy loading logic here
        entry.target.src = entry.target.dataset.src;
    },
    element
);
```

### With Unobserve Callbacks

```javascript
// Create a new LazyLoader instance with custom options
const lazyLoader = new LazyLoader({
    threshold: 0.5,  // Element must be 50% visible
    rootMargin: '100px'  // Add 100px margin around the viewport
});

// Observe an element with before and after unobserve callbacks
const element = document.querySelector('.lazy-element');
const unobserve = lazyLoader.observe(
    (entry) => {
        // This callback is called when the element becomes visible
        console.log('Element is visible!', entry.target);
        entry.target.src = entry.target.dataset.src;
    },
    element,
    {
        beforeUnobserve: (element, observer) => {
            console.log('About to unobserve element:', element);
            // Perform any cleanup or preparation before unobserving
        },
        afterUnobserve: (element, observer) => {
            console.log('Element has been unobserved:', element);
            // Perform any actions after unobserving
        }
    }
);

// Later, you can manually unobserve the element if needed
// This will also trigger the beforeUnobserve and afterUnobserve callbacks
unobserve();
```

### Manually Unobserving

```javascript
// Observe an element and store the unobserve function
const unobserve = lazyLoader.observe(
    (entry) => {
        console.log('Element is visible!', entry.target);
    },
    element
);

// Later, manually unobserve the element
unobserve();
```

### Disconnecting All Observers

```javascript
// Disconnect all observers
// This will call beforeUnobserve and afterUnobserve for each observed element
lazyLoader.disconnect();
```

## API Reference

### Constructor

```javascript
new LazyLoader(options)
```

- `options` (Object, optional): Configuration options for the IntersectionObserver.
  - `threshold` (Number, default: 0.1): A number between 0 and 1 indicating the percentage of the element that needs to be visible to trigger the callback.
  - `rootMargin` (String, default: '0px'): A string specifying the margins around the root element.

### Methods

#### observe(callback, element, options)

Observes an element and calls the callback when it becomes visible.

- `callback` (Function): The function to call when the element becomes visible.
- `element` (Element): The DOM element to observe.
- `options` (Object, optional): Additional options.
  - `beforeUnobserve` (Function, optional): A callback to execute before unobserving the element.
  - `afterUnobserve` (Function, optional): A callback to execute after unobserving the element.
- Returns: A function that can be called to manually unobserve the element.

#### disconnect()

Disconnects all observers and clears the observers map. Calls beforeUnobserve and afterUnobserve callbacks for each observer.

## Example Use Cases

### Lazy Loading Images

```javascript
const lazyLoader = new LazyLoader();

document.querySelectorAll('img[data-src]').forEach(img => {
    lazyLoader.observe(
        (entry) => {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
        },
        img,
        {
            beforeUnobserve: (element) => {
                console.log('About to load image:', element.dataset.src);
            },
            afterUnobserve: (element) => {
                console.log('Image loaded:', element.src);
            }
        }
    );
});
```

### Loading Content on Scroll

```javascript
const lazyLoader = new LazyLoader();

document.querySelectorAll('.lazy-content').forEach(container => {
    lazyLoader.observe(
        (entry) => {
            const container = entry.target;
            fetch(container.dataset.url)
                .then(response => response.text())
                .then(html => {
                    container.innerHTML = html;
                    container.classList.add('loaded');
                });
        },
        container,
        {
            beforeUnobserve: (element) => {
                element.classList.add('loading');
            },
            afterUnobserve: (element) => {
                element.classList.remove('loading');
            }
        }
    );
});
```

### Animations on Scroll

```javascript
const lazyLoader = new LazyLoader({
    threshold: 0.2,
    rootMargin: '50px'
});

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    lazyLoader.observe(
        (entry) => {
            entry.target.classList.add('animated');
        },
        element,
        {
            beforeUnobserve: (element) => {
                console.log('About to animate:', element);
            },
            afterUnobserve: (element) => {
                console.log('Animation triggered:', element);
            }
        }
    );
});
```