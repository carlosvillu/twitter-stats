var AsciiTable = require( 'ascii-table' ),
		Matrix;

var WEEK = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
    RANGES = [ ['00:00-06:00'], ['06:00-12:00'], ['12:00-18:00'], ['18:00-00:00'] ]; 

Matrix= function( list, rows, columns, name ){
	this._matrix = Array.apply(null, Array( rows ) ).map( function(){
			return Array.apply(null, Array( columns ) ).map( function(){ return []; } );
	} );
	this._name = name || 'Matrix';
	this.__fillMatrix( list );
};

Matrix.prototype.bestScore = function( /* null means all the matrix */ atColumn ){
  var self = this,
      best;
  best = this._matrix.reduce( function( memo, row, index_row ){
    return row.reduce( function( best, cell, index_cell ){
      var value = self._matrix[ index_row ][ index_cell ]; 
      return atColumn && atColumn !== index_cell ? best
                                                 : best.value <=  value ? { row: index_row, cell: index_cell, value: value }
                                                                        : best;
    }, memo );
  }, {row: 0, cell: 0, value: 0} );
  return best.value !== 0 ? { range: RANGES[best.row][0], day: WEEK[best.cell], value: best.value }
                          : false;
};

Matrix.prototype.toString = function(){
	return _.reduce( this._matrix, function( memo, row ){
    return memo + row.map( function( cell ){ return cell; } ).join(',') + '\n';
  }, '\n' );
};

Matrix.prototype.print = function( /* Inyect ascii-table instance */ printer ){
	var week = [''].concat( WEEK );

	printer = printer || new AsciiTable( this._name );
	printer.setHeading.apply( printer, week );
	this._matrix.forEach( function( row, index_row ){
		printer.addRow.apply( printer, RANGES[index_row].concat( row ) );
	} );

	return printer.toString();
};

Matrix.prototype.__fillMatrix = function( list ){
	var self = this;
	this._matrix.forEach( function( row, index_row ){
		row.forEach( function( cell, index_cell ){
			var index = parseInt( '' + ( ( index_cell * self._matrix.length ) + index_row ), 10  );
			self._matrix[ index_row ][ index_cell ] = list[ index ];
		} );
	} );
};

module.exports = Matrix;
