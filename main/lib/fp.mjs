
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0]

const curry = (fn) => {
    const arity = fn.length
    const wrapper = (...args) => {
        if (args.length < arity) {
            return (...another) => wrapper(...args, ...another)
        }
        return fn(...args)
    }
    return wrapper
}

export { compose, curry }
