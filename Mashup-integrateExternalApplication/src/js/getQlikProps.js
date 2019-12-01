const evaluateExpression = (app, title) => {
    return new Promise((resolve, reject) => {
        if (title && title != ' ' && typeof title === 'object') {
            app.createGenericObject({
                value: {
                    qStringExpression: title.qStringExpression.qExpr
                }
            }, function (reply) {
                resolve(reply.value)
            });
        } else resolve(title)
    })
}
const objectProper = (app, model) => {
    return new Promise((resolve, reject) => {
        var proper = model.properties,
            title = proper.title,
            subtitle = proper.subtitle,
            footnote = proper.footnote,
            options = { };
        evaluateExpression(app, title).then((val) => {
            options['title'] = val;
            return evaluateExpression(app, subtitle)
        }).then((val) => {
            options['subtitle'] = val;
            return evaluateExpression(app, footnote)
        }).then((val) => {
            options['footnote'] = val;
            resolve(options)
        })
    })
}
const getQlikObjectTitles = (app, id) => {
    return new Promise((resolve, reject) => {
        app.getObjectProperties(id).then(function (model) {
            var proper = model.properties;
            if (proper.qExtendsId) {
                app.getObjectProperties(proper.qExtendsId).then(function (model) {
                    objectProper(app, model).then((val) => {
                        resolve(val);
                    })
                })
            } else {
                objectProper(app, model).then((val) => {
                    resolve(val);
                })
            }
        })
    })
}
const getlist = (app, type) => {
    return new Promise((resolve, reject) => {
        app.getList(type, function (reply) {
            resolve(reply);
        });
    })
}
const getSheetProps = (app, cb) => {
    getlist(app, 'sheet').then((props) => {
        let sheets = [];
        for (const sheet of props.qAppObjectList.qItems) {
            let cells = [];
            for (const cell of sheet.qData.cells) {
                getQlikObjectTitles(app, cell.name).then((titles) => {
                    cell['title'] = titles;
                    cells.push(cell);
                })
                sheet['obj'] = cells;
            }
            sheets.push(sheet)
        }
        cb(sheets);
    })
}

// });