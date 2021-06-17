import { Attribute } from "./attribute"
import { Buffer, BufferTarget, TypedArray } from "./buffer";

// TODO: @Feature instanced attributes

export class AttributeArray {
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
            indexBuffer.target = BufferTarget.Index;
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
        console.log(this);
        for (const info of Object.values(this.offsets)) {
            for (let i = 0, len = info.attributes.length; i < len; ++i) {
                info.attributes[i].stride = info.offset;
            }
        }
        return new AttributeArray(this.id, this.gl, this.attributes, this.indexBuffer);
    }

    private add(
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
