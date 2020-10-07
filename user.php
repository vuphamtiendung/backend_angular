<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User extends CI_Controller {

	public function __construct(){
		parent::__construct();
		$this->load->model('User_model');
	}

	public function index(){
	}
	// get Data
	// test Data
	public function getUser(){
		$dl = $this->User_model->get();
		$dl = json_encode($dl);
		echo $dl;
	}
	//Phương thức đăng kí, thêm mới người dùng
	public function addUser()
	{
		$username = $this->input->post('username');
		$password = $this->input->post('password');
		$password = md5($password);
		$level = $this->input->post('level');
		// echo $this->User_model->insert($username, $password, $level);
		$dulieu = array(
			'username' => $username,
			'password' => $password,
			'level' => $level
			 );
		// echo "<pre>";
		// var_dump($dulieu);
		// echo "</pre>";
		// die();
		if($this->User_model->insert($dulieu)){
			echo 'Thêm thành công';
		}
		else {
			echo 'Thêm thất bại';
		}
	}
	// Phương thức đăng nhập
	public function ApiLogin(){
		// echo 'logic của login được thực hiện ở đây';
		$username = $this->input->post('username');
		$password = $this->input->post('password');
		$password = md5($password); // mã hóa mật khẩu người dùng nhập vào
		// echo $username;
		// echo $password;

		// khai báo 2 session
		// Cách 1: Khai báo các phần tử thông qua mảng 
		// $array = array(
		// 	'emailnguoidung' => '',
		//  	'level' => ''
		// );
		// $this->session->set_userdata($array);
        // Cách 2 là tạo biến session trực tiếp
        $this->session->set_userdata('emailnguoidung', '');
        $this->session->set_userdata('level', '');

		// so sánh
		$this->db->select('*');
        $this->db->where('username', $username);
        $dulieu = $this->db->get('user');
        $dulieu = $dulieu->result_array();
        // kiểm tra
        // if(isset($dulieu[0]['password'])){
        // 	$dulieu[0]['password'] = null;
        // 	echo '$dulieu[0]["password"] chưa được khởi tạo trong bộ nhớ!';
        // 	echo $dulieu[0]['password'];
        // }
        // else{
        // 	return false;
        // }

        $matkhautrongdulieu = $dulieu[0]['password']; // mật khẩu tìm được trong csdl
        // nếu mật khẩu phần fronend trùng với mật khẩu phần data
		if($password == $matkhautrongdulieu){
            if($dulieu[0]['level'] == 1){
                $this->session->set_userdata('emailnguoidung', $username);
                $this->session->set_userdata('level', 1);
                $dulieu = array(
                	'trangthai' => 'dntc',
                	'level' => 1
            	);
            }
            else if($dulieu[0]['level'] == 2){
            	$dulieu = array(
                	'trangthai' => 'dntc',
                	'level' => 2
            	);
            }
            echo json_encode($dulieu);
        }
        // echo $this->session->userdata('emailnguoidung');
        // echo $this->session->userdata('level');

		// echo "<pre>";
		// var_dump($dulieu);
		// echo "</pre>";
	}

	public function ApigetData(){
		$dl = $this->User_model->get();
		$mangmoi = array();
		foreach ($dl as $motphantu) {
			$motphantu['createdate'] = date('d/m/Y', $motphantu['createdate']);
			array_push($mangmoi, $motphantu);
		}
		echo json_encode($mangmoi);
	}

	public function APIupdateData(){
		// lấy dữ liệu về
		$id = $this->input->post('id');
		$username = $this->input->post('username');
		$level = $this->input->post('level');
		echo $id;
		echo $username;
		echo $level;
		// tạo mảng dữ liệu cần update và gọi hàm update trong model
		$mangdl = array(
			'username' => $username,
			'level' => $level
		);
		// điều kiện cần update
		$dieukien = array('id' => $id);
		echo $this->User_model->update($mangdl, $dieukien);
	}
}
/* End of file User.php */
/* Location: ./application/controllers/User.php */