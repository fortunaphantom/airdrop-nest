import { Injectable, Logger } from '@nestjs/common';
// import { UpdateAirdropDto } from './dto/update-airdrop.dto';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { InjectRepository } from '@nestjs/typeorm';
import { AirdropCode } from './entities/airdrop_code.entity';
import { Repository } from 'typeorm';
import { TokenProofDto } from './dto/token-proof.dto';

@Injectable()
export class AirdropService {
  constructor(
    @InjectRepository(AirdropCode)
    private airdropCodeRepository: Repository<AirdropCode>,
    private readonly logger: Logger,
  ) {}

  generateCodes(n: number) {
    const actualCodes = [];
    for (let i = 0; i < n; i++) {
      actualCodes.push(uuidv4());
      this.airdropCodeRepository.save({
        code: actualCodes[i],
        used: false,
      });
    }

    // set merkle root
    const tree = StandardMerkleTree.of(
      actualCodes.map((k) => [k]),
      ['string'],
    );

    // set tree.root to the smart contract
  }

  async fetchCode() {
    // fetch unused code from the database
    const code = await this.airdropCodeRepository.findOneBy({ used: false });

    // mark it as used
    code.used = true;
    await this.airdropCodeRepository.update(
      { code: code.code },
      { used: true },
    );

    // get proof for the selected code
    const codes = await this.airdropCodeRepository.find({
      order: {
        id: 'ASC',
      },
    });

    const tree = StandardMerkleTree.of(
      codes.map((c) => [c.code]),
      ['string'],
    );
    const proof = tree.getProof([code.code]);

    // returns object
    return {
      code: code.code,
      proof,
    } as TokenProofDto;
  }

  deploy() {}
}
