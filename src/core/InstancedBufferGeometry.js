/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InstancedBufferGeometry = function () {

	THREE.BufferGeometry.call( this );

	this.type = 'InstancedBufferGeometry';
	this.maxInstancedCount = undefined;

};

THREE.InstancedBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.InstancedBufferGeometry.prototype.constructor = THREE.InstancedBufferGeometry;

THREE.InstancedBufferGeometry.prototype.addGroup = function ( start, count, instances ) {

	this.groups.push( {

		start: start,
		count: count,
		instances: instances

	} );

};

THREE.InstancedBufferGeometry.prototype.copy = function ( source ) {

	var index = source.index;

	if ( index !== null ) {

		this.setIndex( index.clone() );

	}

	var attributes = source.attributes;

	for ( var name in attributes ) {

		var attribute = attributes[ name ];
		this.addAttribute( name, attribute.clone() );

	}

	var groups = source.groups;

	for ( var i = 0, l = groups.length; i < l; i ++ ) {

		var group = groups[ i ];
		this.addGroup( group.start, group.count, group.instances );

	}

	return this;

};

THREE.InstancedBufferGeometry.prototype.toJSON = function () {
	var data = {
		metadata: {
			version: 4.4,
			type: 'InstancedBufferGeometry',
			generator: 'InstancedBufferGeometry.toJSON'
		}
	};

	// standard InstancedBufferGeometry serialization
	data.uuid = this.uuid;
	data.type = this.type;
	data.maxInstancedCount = this.maxInstancedCount;

	if ( this.name !== '' ) data.name = this.name;

	if ( this.parameters !== undefined ) {
		var parameters = this.parameters;

		for ( var key in parameters ) {

			if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

		}

		return data;
	}

	data.data = { attributes: {} };
	var index = this.index;

	if (index !== null) {
		var array = Array.prototype.slice.call( index.array );

		data.data.index = {
			type: index.array.constructor.name,
			array: array
		};
	}

	var attributes = this.attributes;
	for (var key in attributes) {
		var attribute = attributes[key];
		var array = Array.prototype.slice.call( attribute.array );

		data.data.attributes[ key ] = {
			itemSize: attribute.itemSize,
			type: attribute.array.constructor.name,
			array: array,
			normalized: attribute.normalized,
			instanced: (attribute instanceof THREE.InstancedBufferAttribute),
			meshPerAttribute: attribute.meshPerAttribute || 1
		};
	}

	var groups = this.groups;
	if ( groups.length > 0 ) {
		data.data.groups = JSON.parse( JSON.stringify( groups ) );
	}

	var boundingSphere = this.boundingSphere;
	if ( boundingSphere !== null ) {
		data.data.boundingSphere = {
			center: boundingSphere.center.toArray(),
			radius: boundingSphere.radius
		};
	}

	return data;
}

THREE.EventDispatcher.prototype.apply( THREE.InstancedBufferGeometry.prototype );
