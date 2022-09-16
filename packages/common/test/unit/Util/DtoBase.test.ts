import { BigIntTransformer, DtoBase, DtoTransformer, UIntValue, ValueObject, ValueObjectTransformer } from '@';
import path from 'path';

/**
 * @group unit
 */

@ValueObject('Test')
class TestValueObject extends UIntValue {}

class OtherTestDto extends DtoBase {
  public primitiveField?: number;
}

class TestDto extends DtoBase {
  public primitiveField?: number;

  @BigIntTransformer()
  public bigIntField: bigint;

  @BigIntTransformer()
  public bigIntArrayField: bigint[];

  @ValueObjectTransformer(TestValueObject)
  public valueObjectField?: TestValueObject;

  @ValueObjectTransformer(TestValueObject)
  public valueObjectArrayField?: TestValueObject[];

  @DtoTransformer(OtherTestDto)
  public dtoField?: OtherTestDto;

  @DtoTransformer(OtherTestDto)
  public dtoArrayField?: OtherTestDto[];
}

describe(path.basename(__filename, '.test.ts'), () => {
  test('toJSON', () => {
    const dto = TestDto.cs({
      primitiveField: 1,
      bigIntField: 1000n,
      bigIntArrayField: [2000n, 2001n],
      valueObjectField: TestValueObject.cs(2),
      valueObjectArrayField: [TestValueObject.cs(3), TestValueObject.cs(4)],
      dtoField: OtherTestDto.cs({ primitiveField: 5 }),
      dtoArrayField: [OtherTestDto.cs({ primitiveField: 6 }), OtherTestDto.cs({ primitiveField: 7 })],
    });

    const current = dto.toJSON();

    const expected = {
      bigIntArrayField: ['2000', '2001'],
      bigIntField: '1000',
      dtoArrayField: [
        {
          primitiveField: 6,
        },
        {
          primitiveField: 7,
        },
      ],
      dtoField: {
        primitiveField: 5,
      },
      primitiveField: 1,
      valueObjectArrayField: [3, 4],
      valueObjectField: 2,
    };

    expect(current).toEqual(expected);
  });
});
