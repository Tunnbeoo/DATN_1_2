require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("cors");
const app = express();
const bcrypt = require('bcrypt');
app.use(express.json());
app.use(cors());



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

// API đăng nhập
app.post("/login", function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  checkUserPass(email, password, (err, userInfo) => {
    if (err) {
      return res.status(520).json({ thongbao: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn." });
    } else if (userInfo) {
      
      const jwtBearToken = jwt.sign(
        { userId: userInfo.id, email: userInfo.email },  
        PRIVATE_KEY,  
        { algorithm: "RS256", expiresIn: "120s", subject: userInfo.id.toString() }  
      );
      return res.status(200).json({ token: jwtBearToken, expiresIn: 120, userInfo: userInfo });
    } else {
      return res.status(401).json({ thongbao: "Email hoặc mật khẩu không đúng" });
    }
  });
});

// Hàm kiểm tra email và mật khẩu
const checkUserPass = (email, password, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?'; 
  db.query(query, [email], (err, results) => {
    if (err) {
      callback(err, null);
    } else if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          callback(err, null);
        } else if (isMatch) {
          callback(null, { 
            id: user.id, 
            name: user.name, 
            dia_chi: user.dia_chi, 
            dien_thoai: user.dien_thoai, 
            hinh: user.hinh, 
            role: user.role 
          });
        } else {
          callback(null, null);  
        }
      });
    } else {
      callback(null, null);  
    }
  });
};



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


app.post("/request-change-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Vui lòng nhập email" });

  const checkEmailSql = `SELECT id FROM users WHERE email = ?`;
  db.query(checkEmailSql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });

    const userId = results[0].id;
    const token = Math.floor(100000 + Math.random() * 900000).toString(); // Mã OTP 6 chữ số
    const expireTime = new Date(Date.now() + 15 * 60 * 1000); // Hết hạn sau 15 phút

    // Xóa token cũ trước khi tạo mới
    const sqlUpdate = `UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE id = ?`;
    db.query(sqlUpdate, [token, expireTime, userId], (err) => {
      if (err) return res.status(500).json({ message: "Lỗi server", error: err });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Xác nhận đổi mật khẩu",
        html: `<p>Nhập mã sau để xác nhận đổi mật khẩu:</p>
               <h2>${token}</h2>
               <p>Mã này có hiệu lực trong 15 phút.</p>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ message: "Lỗi gửi email", error });
        res.json({ message: "Mã xác nhận đã được gửi tới email của bạn!" });
      });
    });
  });
});

app.post("/verify-token", (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) return res.status(400).json({ message: "Thiếu thông tin cần thiết" });

  const sql = `SELECT id FROM users WHERE email = ? AND reset_token = ? AND reset_token_expire > NOW()`;
  db.query(sql, [email, token], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server", err });
    if (results.length === 0) return res.status(400).json({ message: "Mã xác nhận không hợp lệ hoặc đã hết hạn" });

    res.json({ message: "Mã xác nhận hợp lệ. Bạn có thể đặt lại mật khẩu" });
  });
});

app.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) return res.status(400).json({ message: "Thiếu thông tin cần thiết" });

  // Kiểm tra độ mạnh của mật khẩu
  if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa và số" });
  }

  const sql = `SELECT id FROM users WHERE email = ? AND reset_token = ? AND reset_token_expire > NOW()`;
  db.query(sql, [email, token], async (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server", err });
    if (results.length === 0) return res.status(400).json({ message: "Mã xác nhận không hợp lệ hoặc đã hết hạn" });

    const userId = results[0].id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Sử dụng transaction để đảm bảo dữ liệu an toàn
    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ message: "Lỗi server", err });

      const sqlUpdate = `UPDATE users SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE id = ?`;
      db.query(sqlUpdate, [hashedPassword, userId], (err) => {
        if (err) {
          db.rollback();
          return res.status(500).json({ message: "Lỗi server", err });
        }
        
        db.commit();
        res.json({ message: "Mật khẩu đã được cập nhật thành công!" });
      });
    });
  });
});

// API forgot-password
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Vui lòng nhập email!' });
  }

  // Kiểm tra xem email có tồn tại trong hệ thống không
  const checkEmailSql = 'SELECT id FROM users WHERE email = ?';
  db.query(checkEmailSql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server', error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống!' });
    }

    // Tạo mã token để gửi qua email
    const token = crypto.randomBytes(32).toString('hex');
    const expireTime = new Date(Date.now() + 15 * 60 * 1000);

    // Lưu token vào cơ sở dữ liệu
    const updateTokenSql = 'UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE email = ?';
    db.query(updateTokenSql, [token, expireTime, email], (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi server khi lưu token', error: err });

      // Gửi email chứa mã token
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác nhận yêu cầu đặt lại mật khẩu',
        html: `<p>Vui lòng nhập mã sau để xác nhận yêu cầu đặt lại mật khẩu:</p>
               <h2>${token}</h2>
               <p>Mã này có hiệu lực trong 15 phút.</p>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ message: 'Lỗi gửi email', error });

        res.json({ message: 'Mã xác nhận đã được gửi tới email của bạn!' });
      });
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