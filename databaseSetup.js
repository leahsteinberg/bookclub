import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt

} from 'graphql';
import {promisify} from 'bluebird';

var fs= require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
db.get = promisify(db.get);
db.all = promisify(db.all);

const Club = new GraphQLObjectType({
  name: 'Club',
  fields() => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    }
  })
});


const Book = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    title: {
      type: GraphQLString
    },
    author: {
      type: GraphQLString
    },
    picUrl: {
      type: GraphQLString
    },
    picHeight: {
      type: GraphQLInt
    },
    picWidth: {
      type: GraphQLInt
    },
    club {
      type: Club
    }
  })
});


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    book: {
      type: Book,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent, {id}){// the second thing passed in is args, we r grabbing part of it.
        /* I am not sure what each argument to resolve is meant for. what does a third arg do???*/
        return db.get('SELECT * FROM Books WHERE id = "'+ id + '";');
      }
    },
    club: {
      type: Club,
      resolve(parent, {id}){
        return db.get('SELECT * FROM Clubs WHERE id = "'+ id +'";');
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query
});


db.serialize(function(){
db.run("DROP TABLE IF EXISTS Books");
  db.run(`CREATE TABLE Books (
            id VARCHAR(255) PRIMARY KEY,
            FOREIGN KEY(club) REFERENCES Clubs(id),
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

  db.run(`CREATE TABLE Clubs (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255)
        )`);

});

graphql(Schema, `{
  book(id: "6ILNpfZmNr"){
    id
    title
    author
    picUrl
    picWidth
    picHeight
    }
}`, db).then((result) => console.log("result: " , result));




