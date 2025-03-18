const mysql = require('mysql');
const exp = require("express");
const app = exp();
var cors = require('cors');
app.use( [ cors() , exp.json() ] );

const db = mysql.createConnection({
   host:'localhost', 
   user:'root',
    password:'', 
    port:3306, 
    database:'laptop_react'
}); 
db.connect( err => { if (err) throw err; console.log('Da ket noi database') });



app.get('/spmoi/:sosp?', function(req, res) {
  let sosp = parseInt(req.params.sosp) || 8;
  if (sosp <= 1) {
      sosp = 10;
  }

  let sql = `SELECT sp.id , sp.id_loai, sp.ten_sp, sp.gia, sp.gia_km, sp.hinh, sp.ngay, sp.luot_xem, tt.ram, tt.dia_cung
              FROM san_pham sp
              LEFT JOIN thuoc_tinh tt ON sp.id = tt.id_sp
              WHERE sp.an_hien = 1
              ORDER BY sp.ngay DESC
              LIMIT ?`;

  db.query(sql, [sosp], (err, data) => {
      if (err) {
          res.json({"Thông báo": "Lỗi lấy danh sách sản phẩm", "error": err});
      } else {
          data.forEach(sp => {
              if (sp.gia && sp.gia_km) {
                  sp.phan_tram_gg = Math.round(((sp.gia - sp.gia_km) / sp.gia) * 100);
              } else {
                  sp.phan_tram_gg = 0;
              }
          });
          res.json(data);
      }
  });
});

app.get('/sphot', function(req, res) {
  let spxn = parseInt(req.params.spxn || 10);
  if (spxn <= 1){
      spxn = 9;
  }
    let sql = `SELECT * FROM san_pham WHERE luot_xem > 900`;
    db.query(sql,(err, data) => {
      if (err) res.json({"thongbao": "Lỗi lấy thông tin sản phẩm hót", err });
      else res.json(data);
    });   
  });
  

  app.get('/sp', function(req, res) {
    let sql = `SELECT * FROM san_pham` 
    db.query( sql, (err, data) => {
      if (err) res.json({"thongbao":"Lỗi lấy chi tiết sản phẩm", err })
      else res.json(data);
     });   
});


app.get('/sanpham/:id', function(req, res) {
  let id = parseInt(req.params.id);      
    if ( isNaN(id) || id <= 0) { 
      res.json({"thong bao":"Không biết sp", "id": id});  return; 
    } 
  let sql = `SELECT id, id_loai, ten_sp, slug, gia, gia_km, hinh, ngay, luot_xem FROM san_pham WHERE id= ?` 

  db.query( sql,id, (err, data) => {
    if (err) res.json({"thongbao":"Lỗi lấy chi tiết sản phẩm", err })
    else res.json(data[0]);
   });   
});


app.get('/sp/:id/:id_loai', function(req, res) {
  let id = parseInt(req.params.id || 0); 
  let id_loai = parseInt(req.params.id_loai || 0);     
  if (isNaN(id) || id <= 0 || isNaN(id_loai) || id_loai <= 0) { 
      res.json({"thong_bao": "Không biết sản phẩm hoặc loại sản phẩm", "id": id, "id_loai": id_loai});  
      return; 
  } 

  let sql = `
    SELECT sp.id, sp.id_loai, sp.ten_sp, sp.slug, sp.gia, sp.gia_km, sp.hinh, sp.ngay, sp.luot_xem, 
           tt.ram, tt.cpu, tt.dia_cung, tt.can_nang
    FROM san_pham sp
    LEFT JOIN thuoc_tinh tt ON sp.id = tt.id_sp
    LEFT JOIN loai l ON sp.id_loai = l.id
    WHERE sp.id = ? AND sp.id_loai = ?;
  `
  ;
   db.query(sql, [id, id_loai], (err, data) => {
    if (err) {
        res.json({"Thông báo": "Lỗi lấy chi tiết sản phẩm", "error": err});
    } else {
        res.json(data[0]);
    }
});  
});


app.get('/sptrongloai/:idloai', function(req, res) {
  let idloai = parseInt(req.params.idloai);
  
  if (isNaN(idloai) || idloai <= 0) {
      res.json({"thong bao": "Không biết loại", "id": idloai});
      return;
  }
  
  let sql = `SELECT id, id_loai, ten_sp, gia, gia_km, hinh, ngay, luot_xem 
             FROM san_pham 
             WHERE id_loai = ? AND an_hien = 1 
             ORDER BY id DESC`;
  
  db.query(sql, [idloai], (err, data) => {
      if (err) {
          res.json({"thongbao": "Lỗi lấy sản phẩm theo loại", err });
      } else {
          res.json(data);
      }
  });
});


app.get('/loai', function(req, res) {
    let sql = `SELECT * FROM loai` 
    db.query( sql, (err, data) => {
      if (err) res.json({"thongbao":"Lỗi lấy danh sách loại", err })
      else res.json(data);
     });   
});


app.get('/loai/:id_loai', function(req, res) {
    let id_loai = parseInt(req.params.id_loai);      
    if ( isNaN(id_loai) || id_loai <= 0) { 
      res.json({"thong bao":"Không biết loại", "id": id_loai});  return; 
    } 
    let sql = `SELECT id, ten_loai, img_loai FROM loai WHERE id = ?` ;
    db.query( sql , id_loai,  (err, data) => {
      if (err) res.json({"thongbao":"Lỗi lấy loai", err })
      else res.json(data[0]);
     });   
});
app.get('/profile/:id', function(req, res) {
  let id = req.params.id;
  console.log("ID nhận được từ request:", id, " - Kiểu dữ liệu:", typeof id);

  id = parseInt(id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "ID không hợp lệ", receivedId: req.params.id });
  }

  let sql = `SELECT id, name, email, dia_chi, dien_thoai, hinh FROM users WHERE id = ?`;
  db.query(sql, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi server", error: err });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json(data[0]); 
  });
});
app.put('/profile/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, dien_thoai, dia_chi } = req.body;

  try {
      const result = await db.query(
          "UPDATE users SET name = ?, email = ?, dien_thoai = ?, dia_chi = ? WHERE id = ?",
          [name, email, dien_thoai, dia_chi, id]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.json({ id, name, email, dien_thoai, dia_chi });
  } catch (error) {
      console.error("Lỗi cập nhật:", error);
      res.status(500).json({ message: "Lỗi server" });
  }
});


app.post('/luudonhang/', function(req, res) {
    let data = req.body;    
    let sql = `INSERT INTO don_hang SET ?` ;
    db.query( sql , data,  function(err, data) {
      if (err) res.json({"id_dh":-1 ,"thongbao":'Lỗi lưu đơn hàng', err })
      else {
           id_dh = data.insertId
           res.json({"id_dh": id_dh ,"thongbao":"Đã lưu đơn hàng" })
      }
     });   
});

app.post('/luugiohang/', function(req, res) {
    let data = req.body;    
    let sql = `INSERT INTO don_hang_chi_tiet SET ?` ;
    db.query( sql , data,  function(err, data) {
      if (err) res.json({"id_dh":-1 ,"thongbao":'Lỗi lưu sản phẩm', err })
      else
           res.json({"thongbao":'Đã lưu sp vào database', "id_sp": data.id_sp})
     });   
});
// so sanh
// Thêm sản phẩm vào danh sách so sánh
app.post('/so-sanh', (req, res) => {
  const { id_user, id_sp } = req.body;

  // Kiểm tra xem đã đủ số sản phẩm để so sánh chưa
  const checkSql = `SELECT COUNT(*) AS total FROM so_sanh WHERE id_user = ?`;
  db.query(checkSql, [id_user], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi kiểm tra danh sách" });

      if (result[0].total >= 4) {
          return res.status(400).json({ message: "Chỉ có thể so sánh tối đa 4 sản phẩm" });
      }

      // Thêm sản phẩm vào danh sách so sánh
      const sql = `INSERT INTO so_sanh (id_user, id_sp) VALUES (?, ?)`;
      db.query(sql, [id_user, id_sp], (err, data) => {
          if (err) return res.status(500).json({ error: "Lỗi thêm sản phẩm vào so sánh" });

          res.json({ message: "Đã thêm sản phẩm vào so sánh" });
      });
  });
});
// Lấy danh sách sản phẩm đang so sánh
app.get('/so-sanh/:id_user', (req, res) => {
  const id_user = req.params.id_user;
  
  const sql = `
      SELECT sp.id, sp.ten_sp, sp.gia, sp.gia_km, sp.hinh, tt.ram, tt.cpu, tt.dia_cung, tt.can_nang 
      FROM so_sanh ss
      JOIN san_pham sp ON ss.id_sp = sp.id
      LEFT JOIN thuoc_tinh tt ON sp.id = tt.id_sp
      WHERE ss.id_user = ?
  `;
  
  db.query(sql, [id_user], (err, data) => {
      if (err) return res.status(500).json({ error: "Lỗi lấy danh sách so sánh" });

      res.json(data);
  });
});
// Xóa sản phẩm khỏi danh sách so sánh
app.delete('/so-sanh/:id_user/:id_sp', (req, res) => {
  const { id_user, id_sp } = req.params;

  const sql = `DELETE FROM so_sanh WHERE id_user = ? AND id_sp = ?`;
  db.query(sql, [id_user, id_sp], (err) => {
      if (err) return res.status(500).json({ error: "Lỗi khi xóa sản phẩm khỏi so sánh" });

      res.json({ message: "Đã xóa sản phẩm khỏi danh sách so sánh" });
  });
});

// admin
app.get('/admin/sp', function(req, res) {
  let sql = `
    SELECT sp.id, sp.id_loai, sp.ten_sp, sp.slug, sp.gia, sp.gia_km, sp.hinh, sp.ngay, sp.luot_xem, 
           tt.ram, tt.cpu, tt.dia_cung, tt.mau_sac,tt.can_nang,
           l.ten_loai
    FROM san_pham sp
    LEFT JOIN thuoc_tinh tt ON sp.id = tt.id_sp
    LEFT JOIN loai l ON sp.id_loai = l.id
    ORDER BY sp.id DESC
  `;
  
  db.query(sql, (err, data) => {
    if (err) {
      res.json({"Thông báo": "Lỗi lấy danh sách sản phẩm", "error": err});
    } else {
      res.json(data);
    }
  });
});




app.get('/admin/sp/:id', function(req, res) {
  let id = parseInt(req.params.id || 0);

  if (isNaN(id) || id <= 0) { 
    res.json({"thong_bao": "ID sản phẩm không hợp lệ", "id": id});  
    return; 
  }

  let sql = `
    SELECT sp.id, sp.id_loai, sp.ten_sp, sp.slug, sp.gia, sp.gia_km, sp.hinh, sp.ngay, sp.luot_xem, 
           tt.ram, tt.cpu, tt.dia_cung, tt.mau_sac, tt.can_nang,
           l.ten_loai
    FROM san_pham sp
    INNER JOIN thuoc_tinh tt ON sp.id = tt.id_sp
    INNER JOIN loai l ON sp.id_loai = l.id
    WHERE sp.id = ?;
  `;
  
  db.query(sql, [id], (err, data) => {
    if (err) {
      res.json({"Thông báo": "Lỗi lấy chi tiết sản phẩm", "error": err});
    } else {
      if (data.length === 0) {
        res.json({"thong_bao": "Không tìm thấy sản phẩm", "id": id});
      } else {
        res.json(data[0]);
      }
    }
  });
});

app.get('/admin/users', function(req, res) {
  let sql = `SELECT * FROM users ORDER BY id DESC` 
  db.query( sql, (err, data) => {
    if (err) res.json({"thongbao":"Lỗi lấy thông tin tài khoản!", err })
    else res.json(data);
   });   
});


// POST - Thêm sản phẩm mới


app.post('/admin/sp', (req, res) => {
  const san_pham = {
    id_loai: req.body.id_loai,
    ten_sp: req.body.ten_sp,
    slug: req.body.slug,
    gia: req.body.gia,
    gia_km: req.body.gia_km,
    hinh: req.body.hinh,
    ngay: req.body.ngay,
    luot_xem: req.body.luot_xem
  };

  const thuoc_tinh = {
    ram: req.body.ram,
    cpu: req.body.cpu,
    dia_cung: req.body.dia_cung,
    mau_sac: req.body.mau_sac,
    can_nang: req.body.can_nang
  };

  // Chèn vào bảng `san_pham`
  const san_phamSQL = 'INSERT INTO san_pham SET ?';
  db.query(san_phamSQL, san_pham, (err, result) => {
    if (err) {
      console.error("Lỗi chèn 1 sp:", err);
      res.json({ "thongbao": "Lỗi chèn 1 sản phẩm", err });
    } else {
      const newIdSP = result.insertId;

      const thuoc_tinhSQL = 'INSERT INTO thuoc_tinh SET ?';
      const thuoc_tinhIDSP = { ...thuoc_tinh, id_sp: newIdSP };

      db.query(thuoc_tinhSQL, thuoc_tinhIDSP, (err, result) => {
        if (err) {
          console.error("Lỗi chèn 1 thuộc tính:", err);
          res.json({ "thongbao": "Lỗi chèn thuộc tính sản phẩm", err });
        } else {
          console.log("Thêm thành công:", result);
          res.json({ "thongbao": "Đã chèn 1 sản phẩm và thuộc tính", "id": newIdSP });
        }
      });
    }
  });
});

app.put('/admin/sp/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // Chuyển id về dạng số nguyên
  if (isNaN(id)) {
    return res.status(400).json({ thongbao: "ID không hợp lệ" });
  }

  const san_pham = {
    id_loai: req.body.id_loai || null,
    ten_sp: req.body.ten_sp || null,
    slug: req.body.slug || null,
    gia: req.body.gia || null,
    gia_km: req.body.gia_km || null,
    hinh: req.body.hinh || null,
    ngay: req.body.ngay || null,
    luot_xem: req.body.luot_xem || null
  };

  const thuoc_tinh = {
    ram: req.body.ram || null,
    cpu: req.body.cpu || null,
    dia_cung: req.body.dia_cung || null,
    mau_sac: req.body.mau_sac || null,
    can_nang: req.body.can_nang || null
  };

  const updateSanPhamSQL = 'UPDATE san_pham SET ? WHERE id = ?';
  db.query(updateSanPhamSQL, [san_pham, id], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
      return res.json({ "thongbao": "Lỗi cập nhật sản phẩm", err });
    } 
    const updateThuocTinhSQL = 'UPDATE thuoc_tinh SET ? WHERE id_sp = ?';
    db.query(updateThuocTinhSQL, [thuoc_tinh, id], (err, result) => {
      if (err) {
        console.error("Lỗi cập nhật thuộc tính:", err);
        return res.json({ "thongbao": "Lỗi cập nhật thuộc tính sản phẩm", err });
      } 
      res.json({ "thongbao": "Đã cập nhật sản phẩm và thuộc tính" });
    });
  });
});




// PUT - Cập nhật sản phẩm
app.put('/admin/sp/:id', (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const sql = 'UPDATE san_pham SET ? WHERE id = ?';
  db.query(sql, [data, id], (err, result) => {
      if (err) {
          res.json({ "thongbao": "Lỗi cập nhật sp", err });
      } else {
          res.json({ "thongbao": "Đã cập nhật sp" });
      }
  });
});

// DELETE - Xóa sản phẩm
app.delete('/admin/sp/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM san_pham WHERE id = ?';
  db.query(sql, id, (err) => {
      if (err) {
          res.json({ "thongbao": "Lỗi khi xóa sp", err });
      } else {
          res.json({ "thongbao": "Đã xóa sp" });
      }
  });
});

app.get('/admin/users/:id', function(req, res) {
  const id = req.params.id;
  const sql = 'SELECT * FROM users WHERE id = ?';
  
  db.query(sql, [id], (err, data) => {
    if (err) {
      res.json({"thongbao": "Lỗi lấy thông tin tài khoản!", err });
    } else {
      res.json(data[0]);
    }
  });
});

app.post('/admin/users', (req, res) => {
  const data = req.body;
  const sql = 'INSERT INTO users SET ?';
  db.query(sql, data, (err, result) => {
      if (err) {
          console.error("Error during insertion:", err);  
          res.json({ "thongbao": "Lỗi chèn 1 tài khoản", err });
      } else {
          console.log("Insertion successful, result:", result); 
          res.json({ "thongbao": "Đã chèn 1 tài khoản", "id": result.insertId });
      }
  });
});


app.put('/admin/users/:id', (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const sql = 'UPDATE users SET ? WHERE id = ?';
  db.query(sql, [data, id], (err) => {
      if (err) {
          res.json({ "thongbao": "Lỗi cập nhật tài khoản", err });
      } else {
          res.json({ "thongbao": "Đã cập nhật tài khoản" });
      }
  });
});

app.delete('/admin/users/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, id, (err) => {
      if (err) {
          res.json({ "thongbao": "Lỗi khi xóa tài khoản", err });
      } else {
          res.json({ "thongbao": "Đã xóa tài khoản" });
      }
  });
});

const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('private-key.txt');

app.post("/login", function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  checkUserPass(email, password, (err, userInfo) => {
    if (err) {
      res.status(520).json({ thongbao: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn." });
    } else if (userInfo) {
          const jwtBearToken = jwt.sign({}, 
          PRIVATE_KEY, { algorithm: "RS256", expiresIn: "120s", subject: userInfo.id.toString() }
      );
      res.status(200).json({ token: jwtBearToken, expiresIn: 120, userInfo: userInfo });
    } else {
      res.status(401).json({ thongbao: "Email hoặc mật khẩu không đúng" });
    }
  });
});

const checkUserPass = (email, password, callback) => {
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      callback(err, null);
    } else if (results.length > 0) {
      const user = results[0];
      callback(null, { id: user.id, name: user.name, dia_chi: user.dia_chi, dien_thoai: user.dien_thoai, hinh: user.hinh, role: user.role });
    } else {
      callback(null, null);
    }
  });
};

app.post('/updatepass', (req, res) => {
  const { userId, passhientai, newPassword } = req.body;

  // Kiểm tra mật khẩu hiện tại
  db.query('SELECT password FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ thongbao: 'Lỗi database' });

    if (results.length === 0) {
      return res.status(404).json({ thongbao: 'User not found' });
    }
    const user = results[0];
    if (user.password !== passhientai) {
      return res.status(400).json({ thongbao: 'Mật khẩu hiện tại không chính xác' });
    }

    db.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId], (err) => {
      if (err) return res.status(500).json({ thongbao: 'Lỗi database' });

      res.status(200).json({ thongbao: 'Đổi mật khẩu thành công!' });
    });
  });
});




// đăng ký tài khoản customer

app.post('/dangky', (req, res) => {
  const data = req.body;
  const sql = 'INSERT INTO users SET ?';
  db.query(sql, data, (err, result) => {
      if (err) {
          console.error("Error during insertion:", err);  
          res.json({ "thongbao": "Lỗi đăng ký tài khoản!", err });
      } else {
          console.log("Insertion successful, result:", result); 
          res.json({ "thongbao": "Đã đăng ký tài khoản thành công!", "id": result.insertId });
      }
  });
});

app.post('/admin/category', (req, res) => {
  const data = req.body;
  const sql = 'INSERT INTO loai SET ? ';
  db.query(sql, data, (err, result) => {
      if (err) {
          console.error("Error during insertion:", err);  
          res.json({ "thongbao": "Lỗi thêm danh mục!", err });
      } else {
          console.log("Insertion successful, result:", result); 
          res.json({ "id": result.insertId });
      }
  });
});
app.get('/admin/category', function(req, res) {
  let sql = `SELECT * FROM loai ORDER BY id DESC` 
  db.query( sql, (err, data) => {
    if (err) res.json({"thongbao":"Lỗi lấy danh sách loại", err })
    else res.json(data);
   });   
});
app.get('/admin/category/:id', function(req, res) {
  const id = req.params.id;
  const sql = 'SELECT * FROM loai WHERE id = ?';
  
  db.query(sql, [id], (err, data) => {
    if (err) {
      res.json({"thongbao": "Lỗi lấy thông tin danh mục!", err });
    } else {
      res.json(data[0]);
    }
  });
});

app.put('/admin/category/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = 'UPDATE loai SET ? WHERE id = ?';
  db.query(sql, [data, id], (err) => {
      if (err) {
          res.json({ "thongbao": "Lỗi cập nhật danh mục", err });
      }
      else {
          // res.json({ "thongbao": "Đã cập nhật danh mục!" });
      }
  }); 
  });
app.delete('/admin/category/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM loai WHERE id = ?';
  db.query(sql, id, (err) => {
      if (err) {
          res.json({ "thongbao": "Lỗi khi xóa danh mục", err });
      } else {
          res.json({ "thongbao": "Đã xóa danh mục!" });
      }
  });
});

// Thi
app.get('/admin/sanpham', function(req, res) {
  let sql = `SELECT * FROM san_pham ORDER BY id DESC` 
  db.query( sql, (err, data) => {
    if (err) res.json({"thongbao":"Lỗi lấy danh sách sản phẩm", err })
    else res.json(data);
   });   
});

app.get('/admin/sanpham/:id', function(req, res) {
  const id = req.params.id;
  let sql = `SELECT id, id_loai, ten_sp, gia, gia_km, hinh, ngay, luot_xem FROM san_pham WHERE id = ?` 
  db.query( sql,id, (err, data) => {
    if (err) res.json({"thongbao":"Lỗi lấy thông tin của 1 sản phẩm!", err })
    else res.json(data[0]);
   });   
});

app.post('/admin/sanpham', (req, res) => {
  const data = req.body;
  const sql = 'INSERT INTO san_pham SET ?';
  db.query(sql, data, (err, result) => {
      if (err) {
          console.error("Error during insertion:", err);  
          res.json({ "thongbao": "Lỗi Thêm 1 sản phẩm", err });
      } else {
          console.log("Insertion successful, result:", result); 
          res.json({ "thongbao": "Đã thêm sản phẩm thành công!", "id": result.insertId });
      }
  });
});





app.get('/admin/danhmuc', function(req, res) {
  let sql = `SELECT * FROM loai ORDER BY id DESC` 
  db.query( sql, (err, data) => {
    if (err) res.json({"thongbao":"Lỗi lấy danh sách sản phẩm", err })
    else res.json(data);
   });   
});


app.get('/admin/danhmuc/:id', function(req, res) {
  const id = req.params.id;
  let sql = `SELECT id, ten_loai, img_loai FROM loai WHERE id = ?`;
  db.query( sql,id, (err, data) => {
    if (err) res.json({"thongbao":"Lỗi lấy thông tin của 1 loại!", err })
    else res.json(data[0]);
   });   
});



app.get('/thongke/sp', function(req, res) {
  let sql = `SELECT COUNT(*) AS total_sanpham FROM san_pham`;
  db.query(sql, (err, data) => {
      if (err) {
          res.json({"thongbao": "Lỗi đếm số sản phẩm", err });
      } else {
          res.json(data[0]);
      }
  });
});







app.listen(3000, () => console.log(`Ung dung dang chay voi port 3000`) );