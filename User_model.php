<?php 
if (!defined('BASEPATH')) exit('No direct script access allowed');

class User_model extends CI_Model {

   /**
    * @name string TABLE_NAME Holds the name of the table in use by this model
    */
   const TABLE_NAME = 'user';

   /**
    * @name string PRI_INDEX Holds the name of the tables' primary index used in this model
    */
   const PRI_INDEX = 'id';

   /**
    * Retrieves record(s) from the database
    *
    * @param mixed $where Optional. Retrieves only the records matching given criteria, or all records if not given.
    *                      If associative array is given, it should fit field_name=>value pattern.
    *                      If string, value will be used to match against PRI_INDEX
    * @return mixed Single record if ID is given, or array of results
    */
        public function get($where = NULL) {
          $this->db->select('*');
          $this->db->from('user');
        if ($where !== NULL) {
           if (is_array($where)) {
             foreach ($where as $field=>$value) {
               $this->db->where($field, $value);
             }
           } else {
             $this->db->where('id', $where);
           }
       }
       $result = $this->db->get()->result_array();

       if ($result) {
          if ($where !== NULL) {
           return array_shift($result);
          } 
          else {
           return $result;
          }
       }
     }

   /**
    * Inserts new data into database
    *
    * @param Array $data Associative array with field_name=>value pattern to be inserted into database
    * @return mixed Inserted row ID, or false if error occured
    */
   public function insert(Array $dulieu) {
     if($this->db->insert('user', $dulieu)) {
       return $this->db->insert_id();
     } 
     else{
       return false;
     }
   }
   /**
    * Updates selected record in the database
    *
    * @param Array $data Associative array field_name=>value to be updated
    * @param Array $where Optional. Associative array field_name=>value, for where condition. If specified, $id is not used
    * @return int Number of affected rows by the update query
    */
   public function update(Array $data, $where = array()) {
     if (!is_array($where)) {
       $where = array('id' => $where);
     }
     $this->db->update('user', $data, $where);
     return $this->db->affected_rows();
   }
   /**
    * Deletes specified record from the database
    *
    * @param Array $where Optional. Associative array field_name=>value, for where condition. If specified, $id is not used
    * @return int Number of rows affected by the delete query
    */
   public function delete($where = array()) {
     if (!is_array()) {
       $where = array('id' => $where);
     }
     $this->db->delete('user', $where);
     return $this->db->affected_rows();
   }
   
 }
 ?>