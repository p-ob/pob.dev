export class EleventyMock {
	constructor() {
		this.plugins = [];
		this.transforms = new Map();
		this.filters = new Map();
		this.globalData = new Map();
		this.passthroughCopies = [];
		this.watchTargets = [];
		this.eventListeners = new Map();
		this.libraryAmendments = new Map();
	}

	addPlugin(plugin, options) {
		this.plugins.push({ plugin, options });
		// Immediately execute the plugin function with this mock
		if (typeof plugin === "function") {
			plugin(this, options);
		}
	}

	addTransform(name, callback) {
		this.transforms.set(name, callback);
	}

	addFilter(name, callback) {
		this.filters.set(name, callback);
	}

	addGlobalData(name, data) {
		this.globalData.set(name, data);
	}

	addPassthroughCopy(copy) {
		this.passthroughCopies.push(copy);
	}

	addWatchTarget(target) {
		this.watchTargets.push(target);
	}

	on(event, callback) {
		if (!this.eventListeners.has(event)) {
			this.eventListeners.set(event, []);
		}
		this.eventListeners.get(event).push(callback);
	}

	amendLibrary(name, callback) {
		if (!this.libraryAmendments.has(name)) {
			this.libraryAmendments.set(name, []);
		}
		this.libraryAmendments.get(name).push(callback);
	}

	// Helper to trigger an event
	emit(event, ...args) {
		const callbacks = this.eventListeners.get(event) || [];
		for (const cb of callbacks) {
			cb(...args);
		}
	}
}
