'use strict';

module.exports = function(stream) {
  stream = stream || process.stdout;

  return {
    resetLine: function() {
      stream.clearLine();
    },

    newLine: function() {
      stream.write('\n');
    },

    resetCursor: function(position) {
      position = position || 0;
      stream.cursorTo(position);
    },

    output: function(message) {
      stream.write(message);
    }
  }
};
