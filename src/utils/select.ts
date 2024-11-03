const pick = (obj: object, keys: string[]) => {
	return keys.reduce<{ [key: string]: unknown }>((o, k) => {
		if (obj && Object.prototype.hasOwnProperty.call(o, k)) {
			o[k] = obj[k as keyof typeof obj];
		}
		return o;
	}, {});
};

const exclude = <Type, Key extends keyof Type>(obj: Type, keys: Key[]): Omit<Type, Key> => {
	for (const key of keys) {
		delete obj[key];
	}
	return obj;
};

export default { pick, exclude };
