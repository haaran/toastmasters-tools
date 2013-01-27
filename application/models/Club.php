<?php
/**
 * User: judda
 * Date: 26/01/13
 * Time: 7:40 PM
 */
class Club extends Eloquent
{
    public static $table='clubs';

    public function members()
    {
        return $this->has_many_and_belongs_to('Member', 'club_member');
    }
}
