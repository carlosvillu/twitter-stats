var AsciiTable = require( 'ascii-table' ),
		Matrix;

Matrix= function( list, rows, columns, name ){
	this._matrix = Array.apply(null, Array( rows ) ).map( function(){
			return Array.apply(null, Array( columns ) ).map( function(){ return []; } );
	} );
	this._name = name || 'Matrix';
	this.__fillMatrix( list );
};

Matrix.prototype.toString = function(){
	return _.reduce( this._matrix, function( memo, row ){
    return memo + row.map( function( cell ){ return cell; } ).join(',') + '\n';
  }, '\n' );
};

Matrix.prototype.print = function( /* Inyect ascii-table instance */ printer ){
	var week = [ '', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
			ranges = [ ['00:00-06:00'], ['06:00-12:00'], ['12:00-18:00'], ['18:00-00:00'] ];

	printer = printer || new AsciiTable( this._name );
	printer.setHeading.apply( printer, week );
	this._matrix.forEach( function( row, index_row ){
		printer.addRow.apply( printer, ranges[index_row].concat( row ) );
	} );

	return printer.toString();
};

Matrix.prototype.__fillMatrix = function( list ){
	var self = this;
	this._matrix.forEach( function( row, index_row ){
		row.forEach( function( cell, index_cell ){
			var index = parseInt( '' + ( ( index_cell * 4 ) + index_row ), 10  );
			self._matrix[ index_row ][ index_cell ] = list[ index ];
		} );
	} );
};

module.exports = Matrix;
