import http from 'http';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevConfig from './webpack.config.js';
import reload from 'reload';
import apiRouter from './server/api/apiRouter';

let app = express();

let port = process.env.npm_package_config_port || 3000;
let isProduction = process.env.NODE_ENV == 'production';

if(!isProduction) {
  let compiler = webpack(webpackDevConfig);
  app.use(webpackDevMiddleware(compiler, {
    // public path should be the same with webpack config
    publicPath: webpackDevConfig.output.publicPath,
    noInfo: true,
    hot: true,
    reload: true,
    stats: {
        colors: true
    }
  }));
  app.use(webpackHotMiddleware(compiler,{
    log: console.log
  }));

}

// view engine setup
app.set('views', path.join(__dirname, './client/dist'));
app.set('view engine', 'html'); // 将模板设置为html
app.engine('html', ejs.renderFile); 
app.use(express.static(path.join(__dirname, './client/dist')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use((req, res, next)=> {
  if(req.url == '/') {
    res.sendFile(path.join(__dirname, './client/dist/index.html'));
  } else {
    next();
  } 
})

// 路由api
app.use('/api', apiRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('404 Not Found');
  err.status = 404;
  res.status(404);
  res.sendFile(path.join(__dirname, './server/404.html'));
  // next(err);
  console.log(err);
});

if(isProduction) {
  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  app.listen(port, (err) => {
    if(err) {
      console.log(`err: ${err}`);
    } else {
      console.log(`server is running on port: ${port}`);
    }
  });
} else {
  // development error handler
  // will print stacktrace
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

  let server = http.createServer(app);
  reload(server, app);
  server.listen(port, (err) => {
    if(err) {
      console.log(`err: ${err}`);
    } else {
      console.log(`server is running on port: ${server.address().port}`);
    }
  });
}


export default app;
