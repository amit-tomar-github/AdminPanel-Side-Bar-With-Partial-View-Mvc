using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using AdminPanel.Models;
namespace AdminPanel.Controllers
{
    public class UserMasterController : Controller
    {
        StringBuilder _SbQry;
        // GET: UserMaster
        public ActionResult ShowUsers()
        {
            UserViewModel userViewModel = new UserViewModel();
            userViewModel.Users= new List<User>();
            ClsDB db = new ClsDB();
            try
            {
                _SbQry = new StringBuilder("Select * From UserMaster");
                db.Connect();
                DataTable dt = db.GetDataTable(_SbQry.ToString());
                foreach (DataRow row in dt.Rows)
                {
                    userViewModel.Users.Add(new User { Id = row["UserId"].ToString(), Name = row["Name"].ToString() });
                }

                return View(userViewModel);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("ErrorMessage", ex.Message);
                ViewBag.ErrorMessage = ex.Message;
                return View(userViewModel.Users);
            }
            finally
            {
                db.DisConnect();
                db = null;
            }
        }

        [HttpPost]
        public JsonResult AddNewUser(User user)
        {
            ClsDB db = new ClsDB();
            try
            {
                if (ModelState.IsValid)
                {
                    _SbQry = new StringBuilder("Insert Into UserMaster(UserId,Name) Values('" + user.Id + "','" + user.Name + "')");
                    db.Connect();
                    int Count = db.ExecuteNonQuery(_SbQry.ToString());
                    if (Count > 0)
                        user.Response = "Y";
                    else
                    {
                        user.Response = "N";
                        user.ErrorMessage = "User could not be added";
                    }
                }
                else
                {
                    foreach (var Key in ModelState.Keys)
                    {
                        if (ModelState[Key].Errors.Count > 0)
                        {
                            user.Response = "N";
                            user.ErrorMessage = ModelState[Key].Errors[0].ErrorMessage;

                            return Json(user, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("ErrorMessage", ex.Message);
                ViewBag.ErrorMessage = ex.Message;
                user.Response = "N";
                user.ErrorMessage = "Error : " + ex.Message;
            }
            finally
            {
                db.DisConnect();
                db = null;
            }
            return Json(user, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditUser(string Id)
        {
            ClsDB db = new ClsDB();
            User user = new User();
            try
            {
                _SbQry = new StringBuilder("Select * From UserMaster Where UserId='" + Id + "'");
                db.Connect();
                DataTable dt = db.GetDataTable(_SbQry.ToString());
                foreach (DataRow row in dt.Rows)
                {
                    user.Id = row["UserId"].ToString();
                    user.Name = row["Name"].ToString();
                }
                user.Response = "Y";
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("ErrorMessage", ex.Message);
                ViewBag.ErrorMessage = ex.Message;
                user.Response = "N";
                user.ErrorMessage = "Error : " + ex.Message;
            }
            finally
            {
                db.DisConnect();
                db = null;
            }
            return Json(user, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult EditUser(User user)
        {
            ClsDB db = new ClsDB();
            try
            {
                if (ModelState.IsValid)
                {
                    _SbQry = new StringBuilder("Update UserMaster Set Name='" + user.Name + "' Where UserId='" + user.Id + "'");
                    db.Connect();
                    int Count = db.ExecuteNonQuery(_SbQry.ToString());
                    if (Count > 0)
                        user.Response = "Y";
                    else
                    {
                        user.Response = "N";
                        user.ErrorMessage = "User could not be updated";
                    }
                }
                else
                {
                    foreach (var Key in ModelState.Keys)
                    {
                        if (ModelState[Key].Errors.Count > 0)
                        {
                            user.Response = "N";
                            user.ErrorMessage = ModelState[Key].Errors[0].ErrorMessage;

                            return Json(user, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("ErrorMessage", ex.Message);
                ViewBag.ErrorMessage = ex.Message;
                user.Response = "N";
                user.ErrorMessage = "Error : " + ex.Message;
            }
            finally
            {
                db.DisConnect();
                db = null;
            }
            return Json(user, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteUser(string Id)
        {
            ClsDB db = new ClsDB();
            User user = new User();
            try
            {
                _SbQry = new StringBuilder("Delete From UserMaster Where UserId='" + Id + "'");
                db.Connect();
                int Count = db.ExecuteNonQuery(_SbQry.ToString());
                if (Count > 0)
                    user.Response = "Y";
                else
                {
                    user.Response = "N";
                    user.ErrorMessage = "User could not be deleted";
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("ErrorMessage", ex.Message);
                ViewBag.ErrorMessage = ex.Message;
                user.Response = "N";
                user.ErrorMessage = "Error : " + ex.Message;
            }
            finally
            {
                db.DisConnect();
                db = null;
            }
            return Json(user, JsonRequestBehavior.AllowGet);
        }
    }
}