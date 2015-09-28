import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLId

} from 'graphql';

var fs= require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function(){
db.run("DROP TABLE IF EXISTS Books");
  db.run(`CREATE TABLE Books (
            id VARCHAR(255) PRIMARY KEY,
            clubId VARCHAR(255),
            title VARCHAR(255),
            author VARCHAR(255),
            picUrl VARCHAR(255),
            picHeight INTEGER,
            picWidth INTEGER
          )`);
  var bookInsert = "INSERT INTO Books (id, clubId, title, author, picUrl, picHeight, picWidth) VALUES";
 bookInsert += '("jNjEqoz5vM", "000001", "Speedboat", "Renata Adler", "http://ecx.images-amazon.com/images/I/41KMMWCnkcL._SL75_.jpg", 75, 47),';
bookInsert+= '("6ILNpfZmNr", "000001", "Eileen", "Ottessa Moshfegh", "http://ecx.images-amazon.com/images/I/41OBDFxgthL._SL75_.jpg", 75, 47)';
  db.run(bookInsert);
 
});

db.close();

const Book = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: GraphQLId
    },
    title: {
      type: GraphQLString
    }
  }

});






