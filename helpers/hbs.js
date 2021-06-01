const moment = require("moment");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  truncate: function (str, len) {
    const shortened = str.indexOf(" ", len);
    if (shortened == -1) {
      return str;
    }
    return str.substring(0, shortened) + "...";
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  editIcon: function (req, jobUser, loggedUser, jobId, floating = true) {
    if (
      req.isAuthenticated() &&
      (jobUser.id == loggedUser.id || req.user.role == "Admin")
    ) {
      if (floating) {
        return `<a href="/jobs/edit/${jobId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/jobs/edit/${jobId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return "";
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(new RegExp('value="' + selected + '"'), "$& selected");
  },
};
