/**
 * LazyLoader - A utility class for lazy loading elements using the Intersection Observer API.
 *
 * This class provides a simple way to observe elements and trigger callbacks when they become visible
 * in the viewport. It also supports callbacks before and after unobserving elements.
 */
class LazyLoader {
	/**
	 * Creates a new LazyLoader instance.
	 *
	 * @param {Object} options - Configuration options for the IntersectionObserver.
	 * @param {number} options.threshold - A number between 0 and 1 indicating the percentage of the element that needs to be visible to trigger the callback.
	 * @param {string} options.rootMargin - A string specifying the margins around the root element.
	 */
	constructor(options = {threshold: 0.1, rootMargin: '0px'}) {
		this.threshold = options.threshold;
		this.rootMargin = options.rootMargin;
		this.observers = new Map();
	}

	/**
	 * Observes an element and calls the callback when it becomes visible.
	 *
	 * @param {Function} callback - The function to call when the element becomes visible.
	 * @param {Element} element - The DOM element to observe.
	 * @param {Object} options - Additional options.
	 * @param {Function} options.beforeUnobserve - A callback to execute before unobserving the element.
	 * @param {Function} options.afterUnobserve - A callback to execute after unobserving the element.
	 * @returns {Function} - A function that can be called to manually unobserve the element.
	 */
	observe(callback, element, options = {}) {
		const id = this.#generateId();
		const beforeUnobserve = options.beforeUnobserve || (() => {
		});
		const afterUnobserve = options.afterUnobserve || (() => {
		});

		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					callback(entry);
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: this.threshold,
			rootMargin: this.rootMargin
		});

		observer.observe(element);
		this.observers.set(id, {observer, element, beforeUnobserve, afterUnobserve});

		return () => this.#unobserve(id);
	}

	/**
	 * Unobserves an element with the given ID.
	 * Calls beforeUnobserve callback before unobserving and afterUnobserve callback after unobserving.
	 *
	 * @param {string} id - The ID of the observer to remove.
	 * @private
	 */
	#unobserve(id) {
		if (!this.observers.has(id)) {
			return;
		}

		const {observer, element, beforeUnobserve, afterUnobserve} = this.observers.get(id);

		beforeUnobserve(element, observer);

		observer.unobserve(element);
		this.observers.delete(id);

		afterUnobserve(element, observer);
	}

	/**
	 * Disconnects all observers and clears the observers map.
	 * Calls beforeUnobserve and afterUnobserve callbacks for each observer.
	 */
	disconnect() {
		this.observers.forEach(({observer, element, beforeUnobserve, afterUnobserve}) => {
			beforeUnobserve(element, observer);

			observer.disconnect();

			afterUnobserve(element, observer);
		});

		this.observers.clear();
	}

	/**
	 * Generates a random ID for an observer.
	 *
	 * @returns {string} - A random string ID.
	 * @private
	 */
	#generateId() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}
}