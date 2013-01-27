<?php

class Sampleclub {

	/**
	 * Make changes to the database.
	 *
	 * @return void
	 */
	public function up()
	{
		$club=Club::create(
            array (
                'club_name' => 'Sample Club'
                , 'club_number' => 1234
                , 'password' => Hash::make('password')
                , 'day_of_meeting' => 1
                , 'creation_date' => '2011-01-01'
            )
        );

        $member1=Member::create(
            array (
                'name' => 'John Smith'
                , 'email_address' => 'john@tempinbox.com'
                , 'month_of_birth' => 5
            )
        );

        $member2=Member::create(
            array (
                'name' => 'Jane Smith'
                , 'email_address' => 'jane@tempinbox.com'
                , 'month_of_birth' => 2
            )
        );

        $member1->clubs()->attach($club);
        $member2->clubs()->attach($club);
	}

	/**
	 * Revert the changes to the database.
	 *
	 * @return void
	 */
	public function down()
	{
		// Get rid of the values
        DB::table('club_member')->delete();
        DB::table('members')->delete();
        DB::table('clubs')->delete();
	}

}