import { Resource, UseAfterFree } from "../common";
import { Attribute } from "./attribute"
import { Buffer, Target, TypedArray } from "./buffer";

// TODO: @Feature instanced attributes

export class AttributeArray implements Resource {
    public readonly handle: WebGLVertexArrayObject;
    constructor(
        public readonly id: number,
        public readonly gl: WebGL2RenderingContext,
        private attributes: Attribute[],
        private indexBuffer?: Buffer<TypedArray>,
    ) {
        // TODO: @Compatibility for WebGL use either the VertexArrayObject extension or rebind each time
        const handle = gl.createVertexArray();
        if (!handle) throw new Error(`Failed to create vertex array`);
        this.handle = handle;

        this.gl.bindVertexArray(this.handle);
        for (let i = 0, len = attributes.length; i < len; ++i) {
            attributes[i].buffer.bind();
            attributes[i].bind();
        }
        if (indexBuffer) {
            indexBuffer.target = Target.Index;
            indexBuffer.bind();
        }
        this.gl.bindVertexArray(null);
    }

    bind() {
        this.gl.bindVertexArray(this.handle);
    }

    unbind() {
        this.gl.bindVertexArray(null);
    }

    free() {
        this.gl.deleteVertexArray(this.handle);
        this.free = UseAfterFree;
        this.bind = UseAfterFree;
        this.unbind = UseAfterFree;
    }
}

export class AttributeArrayBuilder {
    private indexSequence: number = 0;
    private attributes: Attribute[] = [];
    private offsets: Record<any, { offset: number, attributes: Attribute[] }> = {};
    private indexBuffer?: Buffer<TypedArray>;

    constructor(
        private id: number,
        private gl: WebGL2RenderingContext
    ) { }

    build(): AttributeArray {
        for (const info of Object.values(this.offsets)) {
            for (let i = 0, len = info.attributes.length; i < len; ++i) {
                info.attributes[i].stride = info.offset;
            }
        }
        return new AttributeArray(this.id, this.gl, this.attributes, this.indexBuffer);
    }

    /**
     * Add a single attribute.
     * 
     * Users should prefer the specific attribute builder methods (e.g. `.vec4()` or `.mat4()`),
     * as they are much easier to use.
     * 
     * @param buffer Buffer which this attribute targets. Multiple attributes may target the same buffer
     * @param components The number of components this attribute has, e.g. `vec2` has 2 components
     * @param location The attribute index, this is the `location` in `layout(location = 0) in vec4`
     * @param normalized Maps data to the range <0, 1>
     * @param castToFloat Whether the data in the buffer should be cast to floating point
     * 
     * Notes:
     * * Matrix attributes actually span more than one location, which means e.g. a `mat4` attribute is actually
     * made up of 4 `vec4` attributes, and each one needs to be setup individually.
     * * Normalization depends on the buffer data type, e.g. it would map a `Int16Array` by converting `-32767`
     * to `0` and `32767` to 1, while linearly interpolating the rest of the range.
     */
    add(
        buffer: Buffer<TypedArray>,
        components: number,
        location: number,
        normalized: boolean = false,
        castToFloat: boolean = false
    ) {
        this.offsets[buffer.id] ??= { offset: 0, attributes: [] };
        const info = this.offsets[buffer.id];
        const attribute = new Attribute(
            this.gl,
            buffer,
            location,
            components,
            info.offset,
            normalized,
            castToFloat
        );
        info.offset += attribute.byteLength;
        info.attributes.push(attribute);
        this.attributes.push(attribute);
    }

    // TODO: somehow allow explicit indices

    index(buffer: Buffer<TypedArray>): this {
        // TODO: @Debug warn user if one VAO gets multiple EBOs
        this.indexBuffer = buffer;
        return this;
    }
    float(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 1, this.indexSequence++, normalized, true);
        return this;
    }
    vec2(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        return this;
    }
    vec3(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        return this;
    }
    vec4(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        return this;
    }
    int(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 1, this.indexSequence++, normalized, false);
        return this;
    }
    ivec2(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 1, this.indexSequence++, normalized, false);
        return this;
    }
    ivec3(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 1, this.indexSequence++, normalized, false);
        return this;
    }
    ivec4(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 1, this.indexSequence++, normalized, false);
        return this;
    }
    uint(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 1, this.indexSequence++, normalized, false);
        return this;
    }
    uvec2(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 1, this.indexSequence++, normalized, false);
        return this;
    }
    uvec3(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 1, this.indexSequence++, normalized, false);
        return this;
    }
    uvec4(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 1, this.indexSequence++, normalized, false);
        return this;
    }
    mat2(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        return this;
    }
    mat2x3(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        return this;
    }
    mat2x4(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        this.add(buffer, 2, this.indexSequence++, normalized, true);
        return this;
    }
    mat3x2(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        return this;
    }
    mat3(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        return this;
    }
    mat3x4(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        this.add(buffer, 3, this.indexSequence++, normalized, true);
        return this;
    }
    mat4x2(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        return this;
    }
    mat4x3(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        return this;
    }
    mat4(buffer: Buffer<TypedArray>, normalized: boolean = false): this {
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        this.add(buffer, 4, this.indexSequence++, normalized, true);
        return this;
    }
}
