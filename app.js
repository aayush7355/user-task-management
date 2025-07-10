const express = require('express');
const { Model } = require('objection');
const Knex = require('knex');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const exceljs = require('exceljs');

// Initialize Knex
const knex = Knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'aayush1234',
    database: 'task_manager'
  }
});

// Bind Objection to Knex
Model.knex(knex);

// User Model
class User extends Model {
  static get tableName() {
    return 'users';
  }
  static get relationMappings() {
    return {
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'users.id',
          to: 'tasks.user_id'
        }
      }
    };
  }
}

// Task Model
class Task extends Model {
  static get tableName() {
    return 'tasks';
  }
}

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Routes
app.get('/', async (req, res) => {
  const users = await User.query();
  res.render('index', { users });
});

app.get('/add-user', (req, res) => {
  res.render('add-user');
});

app.post('/add-user', async (req, res) => {
  const { name, email, mobile } = req.body;
  try {
    await User.query().insert({ name, email, mobile });
    res.redirect('/');
  } catch (error) {
    res.render('add-user', { error: 'Error adding user' });
  }
});

app.get('/add-task', async (req, res) => {
  const users = await User.query();
  res.render('add-task', { users });
});

app.post('/add-task', async (req, res) => {
  const { user_id, task_name, task_type } = req.body;
  try {
    await Task.query().insert({ user_id, task_name, task_type });
    res.redirect('/');
  } catch (error) {
    const users = await User.query();
    res.render('add-task', { users, error: 'Error adding task' });
  }
});

app.get('/tasks/:userId', async (req, res) => {
  const tasks = await Task.query().where('user_id', req.params.userId);
  res.json(tasks);
});

app.get('/export', async (req, res) => {
  const workbook = new exceljs.Workbook();
  
  // Users sheet
  const userSheet = workbook.addWorksheet('Users');
  userSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Mobile', key: 'mobile', width: 15 }
  ];
  
  const users = await User.query();
  users.forEach(user => userSheet.addRow(user));

  // Tasks sheet
  const taskSheet = workbook.addWorksheet('Tasks');
  taskSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'User ID', key: 'user_id', width: 10 },
    { header: 'Task Name', key: 'task_name', width: 30 },
    { header: 'Task Type', key: 'task_type', width: 15 }
  ];
  
  const tasks = await Task.query();
  tasks.forEach(task => taskSheet.addRow(task));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=users_tasks.xlsx');
  
  await workbook.xlsx.write(res);
  res.end();
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});