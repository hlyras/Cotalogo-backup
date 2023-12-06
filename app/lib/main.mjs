const JALIB = {};

// -----------
// Query
// -----------
JALIB.Query = function () {
  this.query = "";
  this.values = [];
  this.whereUsed = false;

  this.select = function () {
    this.query += "SELECT ";
    return this;
  };

  this.props = function (props) {
    if (props.length) {
      this.query += props.join(", ");
    } else if (!this.query.includes("FROM")) {
      this.query += "*";
    }
    return this;
  };

  this.table = function (table) {
    this.query += ` FROM ${table}`;
    return this;
  };

  this.inners = function (inners) {
    for (let i = 0; i < inners.length; i++) {
      if (inners[i].length === 3) {
        this.query += ` INNER JOIN ${inners[i][0]} ON ${inners[i][1]} = ${inners[i][2]}`;
      } else if (inners[i].length > 3) {
        this.query += ` LEFT JOIN ${inners[i][0]} ON (${inners[i][1]} = ? AND ${inners[i][3]} = ?)`;
        this.values.push(inners[i][2], inners[i][4]);
      }
    }
    return this;
  };

  this.period = function (period) {
    if (period.key && period.start && period.end) {
      if (!this.whereUsed) {
        this.query += " WHERE";
        this.whereUsed = true;
      } else {
        this.query += " AND";
      }
      this.query += ` ${period.key} >= ? AND ${period.key} <= ?`;
      this.values.push(period.start, period.end);
    }
    return this;
  };

  this.params = function (params) {
    if (params.keys.length && params.values.length) {
      if (!this.whereUsed) {
        this.query += " WHERE";
        this.whereUsed = true;
      } else {
        this.query += " AND";
      }

      for (let i = 0; i < params.keys.length; i++) {
        if (i > 0) {
          this.query += " AND";
        }
        this.query += ` ${params.keys[i]} LIKE ?`;
        this.values.push(`%${params.values[i]}%`);
      }
    }
    return this;
  };

  this.strictParams = function (strict_params) {
    if (strict_params.keys.length && strict_params.values.length) {
      if (!this.whereUsed) {
        this.query += " WHERE";
        this.whereUsed = true;
      } else {
        this.query += " AND";
      }

      for (let i = 0; i < strict_params.keys.length; i++) {
        if (i > 0) {
          this.query += " AND";
        }
        this.query += ` ${strict_params.keys[i]} = ?`;
        this.values.push(strict_params.values[i]);
      }
    }
    return this;
  };

  this.order = function (orderParams) {
    if (orderParams.length && orderParams[0].length > 1) {
      this.query += " ORDER BY ";
      for (let i = 0; i < orderParams.length; i++) {
        if (i > 0) {
          this.query += ", ";
        }
        this.query += ` ${orderParams[i][0]} ${orderParams[i][1]}`;
      }
    }
    return this;
  };

  this.limit = function (limit) {
    if (limit) {
      this.query += " LIMIT ?";
      this.values.push(limit);
    }
    return this;
  };

  this.build = function () {
    return {
      query: this.query,
      values: this.values
    };
  };
};

JALIB.Query.fillParam = function (key, value, arr) {
  if (key && value && arr.keys && arr.values) {
    arr.keys.push(key);
    arr.values.push(value);
  } else {
    return false;
  };
};

JALIB.Query.save = function (obj, db) {
  const attributesAsArray = Object.entries(obj);

  const validAttributes = attributesAsArray.filter(([key, value]) => {
    return typeof value === 'number' || typeof value === 'string';
  });

  if (validAttributes.length === 0) {
    return false;
  }

  const props = validAttributes.map(([key]) => key).join(', ');
  const values = validAttributes.map(([key, value]) => value);

  const query = `INSERT INTO ${db} (${props}) VALUES (${values.map(() => '?').join(', ')});`;

  return { query, values };
};

JALIB.Query.update = function (obj, db, param) {
  if (!param || !db) { return false; }

  const validAttributes = Object.entries(obj).filter(([key, value]) => {
    return typeof value === 'number' || typeof value === 'string';
  });

  if (validAttributes.length === 0) { return false; }

  let updateClause = validAttributes.map(([key]) => `${key} = ?`).join(', ');

  const whereClause = validAttributes.find(([key]) => key === param);

  if (!whereClause) { return false; }

  const query = `UPDATE ${db} SET ${updateClause} WHERE ${whereClause[0]} = ?`;

  const values = validAttributes.map(([_, value]) => value);
  values.push(whereClause[1]);

  return { query, values };
};

// -----------
// convertTo
// -----------
JALIB.convertTo = {};

JALIB.convertTo.object = function (target) {
  let obj = {};
  let attributesAsArray = Object.entries(target);
  attributesAsArray.forEach(([key, value]) => {
    if (key && value != null && value != undefined) {
      if (typeof value == 'number' || typeof value == 'string') {
        obj[key] = value;
      };
    }
  });
  return obj;
};

// -----------
// Date
// -----------
JALIB.date = {};

JALIB.date.generate = function () {
  var d = new Date();
  var date = "";
  if (d.getDate() < 10 && parseInt(d.getMonth()) + 1 > 9) {
    date = "0" + d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
  } else if (d.getDate() > 9 && parseInt(d.getMonth()) + 1 < 10) {
    date = "" + d.getDate() + "-0" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
  } else if (parseInt(d.getDate()) < 10 && parseInt(d.getMonth()) + 1 < 10) {
    date = "0" + d.getDate() + "-0" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
  } else {
    date = "" + d.getDate() + "-" + parseInt(d.getMonth() + 1) + "-" + d.getFullYear();
  };
  return date;
};

// -----------
// Input Validation
// -----------
JALIB.validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// -----------
// Timestamp
// -----------
JALIB.date.timestamp = {};

JALIB.date.timestamp.day = function () { return 86400000; };

JALIB.date.timestamp.generate = function () {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  return timestamp;
};

JALIB.date.timestamp.toDate = function (timestamp) {
  let date = new Date(parseInt(timestamp));
  let day; let month; let hour; let minute;
  if (date.getDate() < 10) { day = "0" + date.getDate() } else { day = date.getDate() };
  if (date.getMonth() < 9) { month = "0" + (date.getMonth() + 1) } else { month = (date.getMonth() + 1) };
  if (date.getHours() < 10) { hour = "0" + date.getHours() } else { hour = date.getHours() };
  if (date.getMinutes() < 10) { minute = "0" + date.getMinutes() } else { minute = date.getMinutes() };
  return day + '-' + month + '-' + date.getFullYear() + ' ' + hour + ':' + minute;
};

JALIB.date.timestamp.toDatetime = function (timestamp) {
  let date = new Date(parseInt(timestamp));
  let day; let month; let hour; let minute;
  if (date.getDate() < 10) { day = "0" + date.getDate() } else { day = date.getDate() };
  if (date.getMonth() < 9) { month = "0" + (date.getMonth() + 1) } else { month = (date.getMonth() + 1) };
  if (date.getHours() < 10) { hour = "0" + date.getHours() } else { hour = date.getHours() };
  if (date.getMinutes() < 10) { minute = "0" + date.getMinutes() } else { minute = date.getMinutes() };
  return date.getFullYear() + '-' + month + '-' + day + 'T' + hour + ':' + minute;
};

// -----------
// datetime
// -----------
JALIB.date.datetime = {};

JALIB.date.datetime.toTimestamp = function (datetime) {
  if (datetime) {
    let date = datetime.split("T");
    date.year = date[0].split("-")[0];
    date.month = date[0].split("-")[1];
    date.day = date[0].split("-")[2];
    date.hour = date[1].split(":")[0];
    date.minute = date[1].split(":")[1];
    date = new Date(date.year, date.month - 1, date.day, date.hour, date.minute);
    return date.getTime();
  };
  return false;
};

// -----------
// string
// -----------
JALIB.string = {};

JALIB.string.splitBy = function (string, key) {
  if (string && key) {
    let splited_string = string.split(key);
    return splited_string;
  };
  return false;
};

JALIB.string.replaceChar = (string, regex, content) => {
  string = string.replaceAll(regex, content);
  return string;
};

JALIB.string.hasForbidden = (str) => {
  const forbiddenChars = /[#%&{}\s\\<>*?/$!'":@+,`|[\]^~();¨´áéíóúâêîôûàèìòùäëïöü]/g;
  const hasForbiddenChar = forbiddenChars.test(str);

  if (hasForbiddenChar) {
    return true;
  } else {
    return false;
  }
};

// -----------
// math
// -----------
JALIB.math = {};

JALIB.math.round = {};

JALIB.math.round.toFloat = function () {
  return Math.round((value) * 100) / 100;
};

JALIB.math.round.toInt = function () {
  return +(parseFloat(num).toFixed(places));
};

// -----------
// sort
// -----------
JALIB.sort = (arr, key, order) => {
  return arr = arr.sort((a, b) => {
    if (order == "desc") {
      return b[key] - a[key];
    } else {
      return a[key] - b[key];
    }
  });
};

// -----------
// routes
// -----------
JALIB.route = {};

JALIB.route.toHttps = function (req, res, next) {
  if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) {
    res.redirect(`https://${req.hostname}${req.originalUrl}`);
  } else {
    next();
  }
};

export default JALIB;