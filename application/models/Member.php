<?php
/**
 * User: judda
 * Date: 26/01/13
 * Time: 7:41 PM
 */
class Member extends Eloquent
{
    public static $table='members';

    public function clubs()
    {
        return $this->has_many_and_belongs_to('Club', 'club_member');
    }
}
