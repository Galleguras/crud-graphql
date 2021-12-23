const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;

const courses = require('./courses');

const app = express();

const schema = buildSchema(`
type Course{
    id:ID! 
    title:String! 
    views: Int
}    
type Alert{
  message:String
}
input CourseInput{
  title:String!
  views:Int
}
    
type Query{
    getCourses(page: Int, limit: Int =1): [Course]
    getCourse(id: ID!):Course
}
type Mutation{
  addCourse(input: CourseInput):Course
  updateCourse(id:ID!,input: CourseInput):Course
  deleteCourse(id:ID!):Alert
  }
`);

//template strings

root = {
  getCourses({ page, limit }) {
    if (!page) {
      console.log('xxx-->', page);
      return courses.slice(page * limit, (page + 1) * limit);
    }
    console.log('yyy-->', page);
    return courses;
  },
  getCourse({ id }) {
    console.log(id);
    return (course = courses.find((course) => id == course.id));
  },
  addCourse({ input }) {
    const { title, views } = input;
    const id = String(courses.length + 1);
    const course = { id, title, views };
    courses.push(course);
    return course;
  },
  updateCourse({ id, input }) {
    const { title, views } = input;
    const courseIndex = courses.findIndex((course) => id === course.id);
    const course = courses[courseIndex];
    const newCourse = Object.assign(course, { title, views });
    course[courseIndex] = newCourse;
    return newCourse;
  },
  deleteCourse({ id }) {
    courses = courses.filter((course) => id != course.id);

    return { message: `El curso con id ${id} fue eliminado` };
  },
};

app.get('/', function (req, res) {
  res.json(courses);
});

//midleware
app.use(
  '/graphql',
  graphqlHTTP({ schema: schema, rootValue: root, graphiql: true })
);

app.listen(8080, function () {
  console.log('Servidor iniciado ok');
});
