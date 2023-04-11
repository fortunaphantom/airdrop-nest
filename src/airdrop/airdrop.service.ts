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

  // create(createAirdropDto: CreateAirdropDto) {
  //   return 'This action adds a new airdrop';
  // }

  // findAll() {
  //   return `This action returns all airdrop`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} airdrop`;
  // }

  // update(id: number, updateAirdropDto: UpdateAirdropDto) {
  //   return `This action updates a #${id} airdrop`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} airdrop`;
  // }

  getHashFromCode(code: string) {
    return ethers.utils.solidityKeccak256(
      ['bytes'],
      [ethers.utils.solidityPack(['string'], [code])],
    );
  }

  generateCodes(n: number) {
    const hashes = {};
    const actualCodes = [];
    while (actualCodes.length < n) {
      const code = uuidv4();
      const hash = this.getHashFromCode(code);
      if (!hashes[hash]) {
        hashes[hash] = 1;
        actualCodes.push(code);
      }
    }

    for (let i = 0; i < actualCodes.length; i++) {
      this.airdropCodeRepository.save({
        code: actualCodes[i],
        used: false,
      });
    }

    // set merkle root
    const tree = StandardMerkleTree.of(
      Object.keys(hashes).map((k) => [k]),
      ['bytes32'],
    );

    // set tree.root to the smart contract
  }

  async fetchCode() {
    // fetch unused code from the database
    const code = await this.airdropCodeRepository.findOneBy({ used: false });
    const hash = this.getHashFromCode(code.code);

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
      codes.map((c) => [this.getHashFromCode(c.code)]),
      ['bytes32'],
    );
    const proof = tree.getProof([hash]);

    // returns object
    return {
      hash,
      proof,
    } as TokenProofDto;
  }

  deploy() {}
}
